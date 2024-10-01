const project_repository = require("../repositories/project_repository");

const get_course_project = async (course_id, user_id) => {
    try {
        if (!course_id) {
            throw new Error("Course ID is required.");
        }

        if (!user_id) {
            throw new Error("User ID is required.");
        }

        const project = await project_repository.get_course_project(course_id, user_id);

        return project;
    } catch (err) {
        throw err;
    }
}

const submit_course_project = async (user_id, course_id, course_project_id, repo_url, submission_notes) => {
    try {
        if (!user_id) {
            throw new Error("User ID is required.");
        }

        if (!course_id) {
            throw new Error("Course ID is required.");
        }

        if (!course_project_id) {
            throw new Error("Course Project ID is required.");
        }

        if (!repo_url) {
            throw new Error("Repository URL is required.");
        }

        const submission = await project_repository.submit_course_project(user_id, course_id, course_project_id, repo_url, submission_notes);

        return submission;
    } catch (err) {
        throw err;
    }
}

const get_course_project_review = async (user_id, project_id) => {
    try {
        if (!project_id) {
            throw new Error("Course ID is required.");
        }

        const submissions = await project_repository.get_course_project_review(user_id, project_id);

        return submissions;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    get_course_project,
    submit_course_project,
    get_course_project_review,
}