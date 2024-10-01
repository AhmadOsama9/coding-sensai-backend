const assignment_service = require("../services/assignment_service");

const get_assignment_by_topic_id = async (req, res) => {
    try {
        const { topic_id } = req.params;

        const assignment = await assignment_service.get_assignment_by_topic_id(topic_id);

        return res.status(200).json(assignment);
    } catch (error) {
        console.error("Error in get_assignment_by_topic_id: ", error);
        return res.status(500).send({ error: error.message });
    }
}


const mark_assignment_as_completed = async (req, res) => {
    try {
        const { assignment_id } = req.params;
        const { user_id } = req.user;

        const completion_status = await assignment_service.mark_assignment_as_completed(user_id, assignment_id);

        return res.status(200).json(completion_status);
    } catch (error) {
        console.error("Error in mark_assignment_as_completed: ", error);
        return res.status(500).send({ error: error.message });
    }
}

module.exports = {
    get_assignment_by_topic_id,
    mark_assignment_as_completed
}