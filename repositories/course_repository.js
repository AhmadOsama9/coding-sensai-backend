const pool = require('../config/db');

const {
  get_milestones_for_topic,
  get_milestones_for_topic_no_user,
  get_assignment_for_topic,
  get_common_mistakes_for_topic,
  get_common_mistakes_for_topic_no_user,
  get_code_examples_for_topic,
  get_code_examples_for_topic_no_user,
} = require("../helper_repository/helper_course_repository");

const get_all_courses = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        courses.id, 
        courses.name, 
        courses.description, 
        courses.topics, 
        courses.img_url,
        json_agg(tracks) AS tracks
      FROM courses
      JOIN track_courses ON courses.id = track_courses.course_id
      JOIN tracks ON track_courses.track_id = tracks.id
      GROUP BY courses.id
      ORDER BY courses.created_at DESC
    `);

    return result.rows;
  } catch (err) {
    throw err;
  }
};

const get_course_overview = async (course_id) => {
  try {
    const course = await pool.query(`
      SELECT
        c.id AS course_id,
        c.name AS course_name,
        c.description AS course_description,
        c.img_url AS course_img_url
      FROM
        courses c
      WHERE
        c.id = $1`, [course_id]
    );

    const topics = await pool.query(`
      SELECT
        t.id AS topic_id,
        t.name AS topic_name,
        t.description AS topic_description,
        t."order" AS topic_order,
        t.total_markers AS milestone_count
      FROM
        topics t
      WHERE
        t.course_id = $1
      ORDER BY
        t."order"`, [course_id]
    );

    console.log("courses: ", course.rows[0]);
    console.log("topics: ", topics.rows);

    return {
      course: course.rows[0],
      topics: topics.rows,
    };
  } catch (err) {
    throw err;
  }
};


const get_user_enrolled_courses = async (user_id) => {
  try {
    const enrolledCourses = await pool.query(`
      SELECT
        c.id AS course_id,
        c.name AS course_name,
        c.img_url AS course_img_url,
        uc.created_at AS enrollment_date
      FROM
        user_courses uc
      JOIN courses c ON c.id = uc.course_id
      WHERE uc.user_id = $1
    `, [user_id]);

    return enrolledCourses.rows;
  } catch (err) {
    throw err;
  }
};


const get_user_full_course_and_topic_data = async (course_id, user_id) => {
  try {
    // Fetch course info only (no need for project-related info here)
    const courseData = await pool.query(`
      SELECT
        c.id AS course_id,
        c.name AS course_name,
        c.description AS course_description,
        c.img_url AS course_img_url
      FROM courses c
      WHERE c.id = $1
    `, [course_id]);

    // Extract course information
    const courseInfo = courseData.rows[0];

    // here even though the prev topic is completed, the user can't enter the next topic
    // Needs to be fixed

    // Fetch topics and their detailed information, including the can_enter flag
    const topics = await pool.query(`
      SELECT
        t.id AS topic_id,
        t.name AS topic_name,
        t.description AS topic_description,
        t."order" AS topic_order,
        t.total_markers AS total_milestones,
        COALESCE(ut.completed, false) AS user_completed,
        COALESCE(ut.progress_markers, 0) AS user_passed_milestones,
        (
          t."order" = 1 -- First topic can always be entered
          OR EXISTS (
            SELECT 1
            FROM user_topic_completions utc
            JOIN topics prev_t
              ON prev_t.id = utc.topic_id
            WHERE utc.user_id = $2
              AND prev_t.course_id = $1
              AND prev_t."order" = t."order" - 1
              AND utc.completed = true
          )
        ) AS can_enter
      FROM topics t
      LEFT JOIN user_topic_completions ut 
        ON ut.topic_id = t.id 
        AND ut.user_id = $2
      WHERE t.course_id = $1
      ORDER BY t."order"
    `, [course_id, user_id]);

    // Fetch detailed information for each topic
    const topicDetailsPromises = topics.rows.map(async (topic) => {
      const topic_id = topic.topic_id;

      // Fetch milestones, assignments, common mistakes, and code examples in parallel
      const [milestones, assignment, commonMistakes, codeExamples] = await Promise.all([
        get_milestones_for_topic(topic_id, user_id),
        get_assignment_for_topic(topic_id, user_id),
        get_common_mistakes_for_topic(topic_id, user_id),
        get_code_examples_for_topic(topic_id)
      ]);

      return {
        ...topic,
        milestones,
        assignment,
        commonMistakes,
        codeExamples
      };
    });

    const topicDetails = await Promise.all(topicDetailsPromises);

    // Return combined course and topic data
    return {
      ...courseInfo,
      topics: topicDetails
    };
  } catch (err) {
    throw err;
  }
};


const get_full_course_and_topic_data = async (course_id, user_id) => {
  try {
    // Fetch the general course information
    const courseData = await pool.query(`
      SELECT
        c.id AS course_id,
        c.name AS course_name,
        c.description AS course_description,
        c.img_url AS course_img_url,
        cp.id AS project_id,
        cp.title AS project_title,
        cp.description AS project_description,
        c.topics AS total_topics
      FROM
        courses c
      LEFT JOIN course_projects cp ON cp.course_id = c.id
      WHERE
        c.id = $1
      GROUP BY c.id, cp.id`, [course_id]
    );

    const courseInfo = courseData.rows[0];

    const enrollmentData = await pool.query(`
      SELECT id FROM user_courses
      WHERE course_id = $1 AND user_id = $2`, [course_id, user_id]
    );

    // If any row is returned, the user is enrolled
    const isEnrolled = enrollmentData.rowCount > 0;

    // Fetch topics related to the course without user data
    const topics = await pool.query(`
      SELECT
        t.id AS topic_id,
        t.name AS topic_name,
        t.description AS topic_description,
        t."order" AS topic_order,
        t.total_markers AS total_milestones
      FROM
        topics t
      WHERE
        t.course_id = $1
      ORDER BY
        t."order"`, [course_id]
    );

    // Fetch detailed information for each topic
    const topicDetailsPromises = topics.rows.map(async (topic) => {
      const topic_id = topic.topic_id;

      const [milestones, assignment, commonMistakes, codeExamples] = await Promise.all([
        get_milestones_for_topic_no_user(topic_id),
        get_assignment_for_topic(topic_id),
        get_common_mistakes_for_topic_no_user(topic_id),
        get_code_examples_for_topic_no_user(topic_id)
      ]);

      return {
        ...topic,
        milestones,
        assignment,
        commonMistakes,
        codeExamples
      };
    });

    const topicDetails = await Promise.all(topicDetailsPromises);

    // Return course info with user enrollment status
    return {
      ...courseInfo,
      is_enrolled: isEnrolled,
      topics: topicDetails
    };
  } catch (err) {
    throw err;
  }
};

const enroll_user_in_course = async (user_id, course_id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if the user is already enrolled in the course
    const existingEnrollment = await client.query(`
      SELECT 1 FROM user_courses WHERE user_id = $1 AND course_id = $2
    `, [user_id, course_id]);

    if (existingEnrollment.rowCount > 0) {
      await client.query('COMMIT');
      return { message: 'User is already enrolled' };
    }

    // Enroll the user if they are not already enrolled
    await client.query(`
      INSERT INTO user_courses (user_id, course_id)
      VALUES ($1, $2)
    `, [user_id, course_id]);

    // Initialize topic completions
    const topics = await client.query(`
      SELECT id FROM topics WHERE course_id = $1
    `, [course_id]);

    for (const topic of topics.rows) {
      await client.query(`
        INSERT INTO user_topic_completions (user_id, course_id, topic_id, completed)
        VALUES ($1, $2, $3, false)
      `, [user_id, course_id, topic.id]);
    }

    await client.query('COMMIT');
    return { message: 'User successfully enrolled' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};



module.exports = {
  get_all_courses,
  get_course_overview,
  get_full_course_and_topic_data,
  get_user_full_course_and_topic_data,
  get_user_enrolled_courses,
  enroll_user_in_course
};
