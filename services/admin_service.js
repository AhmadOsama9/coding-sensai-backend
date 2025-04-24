const admin_repository = require("../repositories/admin_repository");
const { generateToken } = require("../utils/jwt");

const authenticate_admin = async ({ username, password }) => {
    try {
        let admin = await admin_repository.find_admin_by_username(username);
        if (!admin) {
            throw new Error("Admin not found.");
        }

        if (admin.password !== password) {
            throw new Error("Invalid password.");
        }

        return generateToken(admin.id, "admin");
    } catch (err) {
        throw new Error(err.message);
    }
}

/*
CREATE TYPE course_project_status AS ENUM ('failed', 'succeeded', 'reviewing');


*/

const fetch_all_users_projects = async (status) => {
    try {
        if (!status || !["failed", "succeeded", "reviewing"].includes(status)) {
            throw new Error("Invalid status.");
        }

        return await admin_repository.fetch_all_users_projects(status);
    } catch (err) {
        throw new Error(err.message);
    }
}

const mark_project_as_reviewed = async (project_id, status, review_notes) => {
    try {
        if (!project_id || !status || !["failed", "succeeded"].includes(status)) {
            throw new Error("Invalid parameters.");
        }

        if (!review_notes) {
            throw new Error("Review notes are required.");
        }

        return await admin_repository.mark_project_as_reviewed(project_id, status, review_notes);
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    authenticate_admin, 
    fetch_all_users_projects,
    mark_project_as_reviewed
};