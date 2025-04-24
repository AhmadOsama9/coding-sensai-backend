const admin_service = require("../services/admin_service");


const admin_login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const {token, expiresIn } = await admin_service.authenticate_admin({ username, password });


        res.status(200).json({ token, expiresIn });
    } catch (err) {
        console.error("Error logging in admin:", err);
        res.status(400).json({ error: err.message });
    }
}

const fetch_all_users_projects = async (req, res) => {
    try {
        const { status } = req.query;
        const projects = await admin_service.fetch_all_users_projects(status);

        res.status(200).json(projects);
    } catch (err) {
        console.error("Error fetching all users' projects:", err);
        res.status(400).json({ error: err.message });
    }
}

const mark_project_as_reviewed = async (req, res) => {
    try {
        const { project_id, status, review_notes } = req.body;
        const updated = await admin_service.mark_project_as_reviewed(project_id, status, review_notes);

        res.status(200).json({ updated });
    } catch (err) {
        console.error("Error marking project as reviewed:", err);
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    admin_login,
    fetch_all_users_projects,
    mark_project_as_reviewed
}