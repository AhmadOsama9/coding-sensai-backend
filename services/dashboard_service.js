const dashboard_repository = require("../repositories/dashboard_repository");


// Also handle the return of the top users
// Also handle the assessments for each category
// As I thought before probably will be on it's own and when click
// Will be the same approach as the dashboard data
// While at the same time for example put a dummy chart for the UI
// Or I could just return it but I think the query of 3 days in addition to this one 
// For one page will be too bad for the performance
const get_user_dashboard = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error("User id is required");
        }

        const user_points = await dashboard_repository.get_user_points(user_id);
        const daily_points = await dashboard_repository.get_daily_points(user_id, new Date());
        const login_streak = await dashboard_repository.get_login_streak(user_id);
        const top_users = await dashboard_repository.get_top_users();
 
        return {
            total_points: user_points ? user_points.total_points : 0,
            daily_points: daily_points || [],
            current_streak: login_streak ? login_streak.current_streak : 0,
            max_streak: login_streak ? login_streak.max_streak : 0,
            last_login_date: login_streak ? login_streak.last_login_date : null,
            top_users: top_users || []
        };
    } catch (err) {
        throw err;
    }
}


const handle_user_logging = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error("User id is required");
        }

        await dashboard_repository.create_daily_points(user_id, new Date());

    } catch (err) {
        throw err;
    }
}

// Return the topics finished in each course
// We can update it later on to be for example only courses that the user has finished any topic in

const get_completed_topics = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error("User id is required");
        }

        return await dashboard_repository.get_completed_topics(user_id);
    } catch (err) {
        throw err;
    }
}


module.exports = {
    get_user_dashboard,
    handle_user_logging,
    get_completed_topics
}