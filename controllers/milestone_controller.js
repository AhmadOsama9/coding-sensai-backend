const milestone_service = require("../services/milestone_service");


const get_milestone_by_id = async (req, res) => {
    try {
        const { milestone_id } = req.params;
        const milestone = await milestone_service.get_milestone_by_id(milestone_id);

        return res.status(200).json(milestone);
    } catch (error) {
        console.error("Error in get_milestone_by_id: ", error);
        return res.status(500).send({ error: error.message });
    }
}

const mark_milestone_as_complete = async (req, res) => {
    try {
        const { milestone_id } = req.params;
        const { user_id } = req.user;

        const completion_status = await milestone_service.mark_milestone_as_complete(milestone_id, user_id);

        return res.status(200).json(completion_status);

    } catch (error) {
        console.error("Error in mark_milestone_as_completed", error);
        return res.status(500).send({ error: error.message });
    }
}

const get_random_quiz_for_unsolved_milestone = async (req, res) => {
    try {
        const { milestone_id } = req.params;
        const { user_id } = req.user;

        const quiz = await milestone_service.get_random_quiz_for_unsolved_milestone(milestone_id, user_id);

        return res.status(200).json(quiz);

    } catch (error) {
        console.error("Error in get_random_quiz_for_unsolved_milestone", error);
        return res.status(500).send({ error: error.message });
    }
}

const get_all_quiz_for_solved_milestone = async (req, res) => {
    try {
        const { milestone_id } = req.params;
        const { user_id } = req.user;

        const quiz = await milestone_service.get_all_quiz_for_solved_milestone(milestone_id, user_id);

        return res.status(200).json({ quiz });

    } catch (error) {
        console.error("Error in get_all_quiz_for_solved_milestone", error);
        return res.status(500).send({ error: error.message });
    }
}


const submit_quiz = async (req, res) => {
    try {
        const { milestone_id, quiz_id } = req.params;
        const { user_id } = req.user;
        const { answers } = req.body;

        const data = await milestone_service.submit_quiz(milestone_id, quiz_id, user_id, answers);

        console.log("Milestone quiz submitted successfully");

        return res.status(200).json({ data });

    } catch (error) {
        console.error("Error in submit_quiz", error);
        return res.status(500).send({ error: error.message });
    }
}


module.exports = {
    get_milestone_by_id,
    mark_milestone_as_complete,
    get_random_quiz_for_unsolved_milestone,
    get_all_quiz_for_solved_milestone,
    submit_quiz
}

