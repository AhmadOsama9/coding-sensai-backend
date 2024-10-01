const assignment_repository = require("../repositories/assignment_repository");

const get_assignment_by_topic_id = async (topic_id) => {
    try {

        if (!topic_id) {
            throw new Error("Topic ID is required.");
        }


        const assignment = await assignment_repository.get_assignment_by_topic_id(topic_id);

        return assignment;
    } catch (err) {
        throw err;
    }
}

const mark_assignment_as_completed = async (user_id, assignment_id) => {
    try {
        if (!user_id) {
            throw new Error("User ID is required.");
        }

        if (!assignment_id) {
            throw new Error("Assignment ID is required.");
        }

        const completion_status = await assignment_repository.mark_assignment_as_completed(user_id, assignment_id);

        return completion_status;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    get_assignment_by_topic_id,
    mark_assignment_as_completed
}