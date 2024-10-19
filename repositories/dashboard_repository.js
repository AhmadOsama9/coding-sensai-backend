const { query } = require('express');
const { initPool } = require("../config/db");

const pool = initPool();

require('dotenv').config();
/*
Relevant tables 

CREATE TABLE "user_points" (
  "user_id" INTEGER UNIQUE NOT NULL PRIMARY KEY,
  "total_points" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

CREATE TABLE "daily_points" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "points" INTEGER NOT NULL,
  "date" DATE NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

CREATE TABLE "login_streaks" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" INTEGER UNIQUE NOT NULL,
  "current_streak" INTEGER NOT NULL DEFAULT 0,
  "max_streak" INTEGER NOT NULL DEFAULT 0,
  "last_login_date" DATE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

);
*/

// 1- Now we can display the user points
const get_user_points = async (user_id) => {
    try {
        const result = await pool.query("SELECT total_points FROM user_points WHERE user_id = $1", [user_id]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

// 2. Now we can make the heatmap using the points for that day
// And limit it to 7 days so the last 7 rows
const get_daily_points = async (user_id, date) => {
    try {
        // Get the last 7 days including today
        const startDate = new Date(date);
        startDate.setDate(startDate.getDate() - 6);
        const endDate = new Date(date);

        const result = await pool.query(
            "SELECT date, points FROM daily_points WHERE user_id = $1 AND date BETWEEN $2 AND $3 ORDER BY date DESC",
            [user_id, startDate, endDate]
        );
        
        // Initialize a map for days of the week
        const pointsMap = {
            'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0
        };

        // Map the results to the days of the week
        result.rows.forEach(row => {
            const dayName = new Date(row.date).toLocaleDateString('en-US', { weekday: 'short' });
            pointsMap[dayName] = row.points;
        });

        // Convert the map to an array
        const dailyPoints = Object.keys(pointsMap).map(day => ({
            day: day,
            points: pointsMap[day]
        }));

        return dailyPoints;
    } catch (err) {
        throw err;
    }
};


// 3. Now we can display the login streak
// We will display the current streak, max streak and last login date, not sure if I will need the login date
const get_login_streak = async (user_id) => {
    try {
        const result = await pool.query("SELECT current_streak, max_streak, last_login_date FROM login_streaks WHERE user_id = $1", [user_id]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
}

// 4. Now we can display the top users
// We will display the top 10 users based on the total points
// Here we could also return the user username, but we said we don't want the clickable thing
const get_top_users = async () => {
    try {
        const result = await pool.query(`
            SELECT u.username, u.image_url, up.total_points
            FROM user_points up
            JOIN users u ON up.user_id = u.id
            ORDER BY up.total_points DESC
            LIMIT 10;
        `);
        return result.rows; 
    } catch (err) {
        console.error('Error fetching top users:', err);
        throw err;
    }
};


// Here for the daily login
// We will create the daily points
// We will update the user points
// We will update the login streak

// We will make sure that the user daily points was not created before

// So for all the users we create we should create for them the user_points
const create_daily_points = async (user_id, date) => {
    let client;
    try {
        const daily_login_points = parseInt(process.env.DAILY_LOGIN_POINTS);
        
        client = await pool.connect();

        await client.query('BEGIN');

        // 1. Make sure that the daily points were not created before
        const daily_points = await client.query("SELECT points FROM daily_points WHERE user_id = $1 AND date = $2", [user_id, date]);
        if (daily_points.rows.length) {
            throw new Error('Daily points already created');
        }

        // 2. Create the daily points
        await client.query("INSERT INTO daily_points (user_id, points, date) VALUES ($1, $2, $3)", [user_id, daily_login_points, date]);

        // 3. Update the user points
        await client.query("UPDATE user_points SET total_points = total_points + $1 WHERE user_id = $2", [daily_login_points, user_id]);

        // 4. Update the login streak
        const result = await client.query("SELECT last_login_date FROM login_streaks WHERE user_id = $1", [user_id]);

        // Get the current date
        const current_date = new Date();
        const current_date_midnight = new Date(current_date.setHours(0, 0, 0, 0));

        if (result.rows.length > 0) {
            const { last_login_date } = result.rows[0];
            const last_login_midnight = new Date(new Date(last_login_date).setHours(0, 0, 0, 0));
            const difference_in_days = (current_date_midnight - last_login_midnight) / (1000 * 60 * 60 * 24);

            if (difference_in_days === 1) {
                // Increment streak as the user logged in consecutively
                await client.query("UPDATE login_streaks SET current_streak = current_streak + 1, last_login_date = $1 WHERE user_id = $2", [current_date, user_id]);
            } else if (difference_in_days > 1) {
                // Reset streak if there is a gap larger than a day
                await client.query("UPDATE login_streaks SET current_streak = 1, last_login_date = $1 WHERE user_id = $2", [current_date, user_id]);
            }
        } else {
            // Initialize streak data if there is no entry for the user
            await client.query("INSERT INTO login_streaks (user_id, current_streak, last_login_date, max_streak) VALUES ($1, $2, $3, $4)", [user_id, 1, current_date, 1]);
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/*

CREATE TABLE "tracks" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Added the image to the course 
-- So one image for each course
CREATE TABLE "courses" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "topics" INTEGER,
  "img_url" VARCHAR(100),
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "user_topic_completions" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "course_id" INTEGER NOT NULL,
  "topic_id" INTEGER NOT NULL,
  "completed" BOOLEAN DEFAULT FALSE,
  "passed_milestones" INTEGER DEFAULT 0, -- Cause even the common_mistake will be treated as a milestone
  "created_at" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("topic_id") REFERENCES "topics" ("id") ON DELETE CASCADE
);
*/

const get_completed_topics = async (user_id) => {
    try {
        const query = `
            SELECT 
                c.name AS course_name, 
                COUNT(utc.topic_id) AS completed_topics,
                c.topics AS total_topics
            FROM user_topic_completions utc
            INNER JOIN courses c ON utc.course_id = c.id
            WHERE utc.user_id = $1 AND utc.completed = TRUE 
            GROUP BY c.name, c.topics, utc.course_id;
        `;
        const values = [user_id];
        const result = await pool.query(query, values);
        return result.rows; 
    } catch (err) {
        throw err;
    }
};




module.exports = {
    get_user_points,
    get_daily_points,
    get_login_streak,
    get_top_users,
    create_daily_points,
    get_completed_topics
}