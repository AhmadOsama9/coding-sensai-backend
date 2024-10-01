const dashboard_service = require("../services/dashboard_service");


const get_user_dashboard = async (req, res) => {
    try {
        console.log("get_user_dashboard");
        const { user_id } = req.user;
        const dashboard_data = await dashboard_service.get_user_dashboard(user_id);

        res.status(200).json(dashboard_data);

    } catch (error) {
        console.error("Error in get_user_dashboard: ", error);
        res.status(500).send({ error: error.message });
    }
}

const handle_user_logging = async (req, res) => {
    try {
        console.log("handle_user_logging");
        const { user_id } = req.user;
        await dashboard_service.handle_user_logging(user_id);

        res.status(200).send("User logged today successfully");

    } catch (error) {
        console.error("Error in handle_user_logging: ", error);
        res.status(500).send({ error: error.message });
    }
}

const get_completed_topics = async (req, res) => {
    try {
        console.log("get_completed_topics");
        const { user_id } = req.user;
        const completed_topics = await dashboard_service.get_completed_topics(user_id);

        res.status(200).json(completed_topics);

    } catch (error) {
        console.error("Error in get_completed_topics: ", error);
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    get_user_dashboard,
    handle_user_logging,
    get_completed_topics
}