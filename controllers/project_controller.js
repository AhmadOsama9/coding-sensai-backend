const project_service = require("../services/project_service");

const get_course_project = async (req, res) => {
    try {
        const { course_id } = req.params;
        const { user_id } = req.user;

        const project = await project_service.get_course_project(course_id, user_id);

        console.log("project in get_course_project: ", project);

        return res.status(200).json(project);
    } catch (error) {
        console.error("Error in get_course_project: ", error);
        return res.status(500).send({ error: error.message });
    }
}

const submit_course_project = async (req, res) => {
    try {
        const { course_id, course_project_id, repo_url, submission_notes } = req.body;
        const { user_id } = req.user;

        const submission = await project_service.submit_course_project(user_id, course_id, course_project_id, repo_url, submission_notes);

        return res.status(200).json(submission);
    } catch (error) {
        console.error("Error in submit_course_project: ", error);
        return res.status(500).send({ error: error.message });
    }
}

const get_course_project_review = async (req, res) => {
    try {
        const { project_id } = req.params;
        const { user_id } = req.user;

        const submissions = await project_service.get_course_project_review(user_id, project_id);

        return res.status(200).json(submissions);
    } catch (error) {
        console.error("Error in get_course_project_submissions: ", error);
        return res.status(500).send({ error: error.message });
    }
}


module.exports = {
    get_course_project,
    submit_course_project,
    get_course_project_review,
}
