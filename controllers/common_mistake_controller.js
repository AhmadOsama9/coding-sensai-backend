const common_mistake_service = require("../services/common_mistake_service");


const get_common_mistake_by_id = async (req, res) => {
    try {
        const { mistake_id } = req.params;
        const mistake = await common_mistake_service.get_common_mistake_by_id(mistake_id);

        return res.status(200).json(mistake);
    } catch (error) {
        console.error("Error in get_common_mistake_by_id: ", error);
        return res.status(500).send({ error: error.message });
    }
}


const mark_common_mistake_as_complete = async (req, res) => {
    try {
        const { mistake_id } = req.params;
        const { user_id } = req.user;

        const completion_status = await common_mistake_service.mark_common_mistake_as_complete(mistake_id, user_id);

        return res.status(200).json(completion_status);
    } catch (error) {
        console.error("Error in mark_common_mistake_as_complete: ", error);
        return res.status(500).send({ error: error.message });
    }
}

const get_random_quiz_for_unsolved_mistake = async (req, res) => {
    try {
        const { mistake_id } = req.params;
        const { user_id } = req.user;

        const quiz = await common_mistake_service.get_random_quiz_for_unsolved_mistake(mistake_id, user_id);

        return res.status(200).json(quiz);
    } catch (error) {
        console.error("Error in get_random_quiz_for_unsolved_mistake: ", error);
        return res.status(500).send({ error: error.message });
    }
}

const get_all_quiz_for_solved_mistake = async (req, res) => {
    try {
        const { mistake_id } = req.params;
        const { user_id } = req.user;

        const quiz = await common_mistake_service.get_all_quiz_for_solved_mistake(mistake_id, user_id);

        return res.status(200).json({ quiz });
    } catch (error) {
        console.error("Error in get_all_quiz_for_solved_mistake: ", error);
        return res.status(500).send({ error: error.message });
    }
}


const submit_mistake_quiz = async (req, res) => {
    try {
        const { mistake_id, quiz_id } = req.params;
        const { user_id } = req.user;
        const { answers } = req.body;

        const data = await common_mistake_service.submit_mistake_quiz(mistake_id, quiz_id, user_id, answers);

        console.log("Mistake quiz submitted successfully");

        return res.status(200).json({ data });
    } catch (error) {
        console.error("Error in submit_mistake_quiz: ", error);
        return res.status(500).send({ error: error.message });
    }
}


module.exports = {
    get_common_mistake_by_id,
    mark_common_mistake_as_complete,
    get_random_quiz_for_unsolved_mistake,
    get_all_quiz_for_solved_mistake,
    submit_mistake_quiz
}