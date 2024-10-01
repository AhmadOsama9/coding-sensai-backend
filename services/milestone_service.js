const milestone_repository = require("../repositories/milestone_repository");

const get_milestone_by_id = async (milestone_id) => {
    try {
        if (!milestone_id) {
            throw new Error("Milestone ID is required.");
        }

        const milestone = await milestone_repository.get_milestone_by_id(milestone_id);

        return milestone;
    } catch (err) {
        throw err;
    }
}

const mark_milestone_as_complete = async (milestone_id, user_id) => {
    try {
        if (!milestone_id) {
            throw new Error("Milestone ID is required.");
        }

        if (!user_id) {
            throw new Error("User ID is required.");
        }

        const completion_status = await milestone_repository.mark_milestone_as_completed(milestone_id, user_id);

        return completion_status;
    } catch (err) {
        throw err;
    }
}

const get_random_quiz_for_unsolved_milestone = async (milestone_id, user_id) => {
    try {
        if (!milestone_id) {
            throw new Error("Milestone ID is required.");
        }

        if (!user_id) {
            throw new Error("User ID is required.");
        }

        const quiz = await milestone_repository.get_random_quiz_for_unsolved_milestone(milestone_id, user_id);

        return quiz;
    } catch (err) {
        throw err;
    }
}


const get_all_quiz_for_solved_milestone = async (milestone_id, user_id) => {
    try {
        if (!milestone_id) {
            throw new Error("Milestone ID is required.");
        }

        if (!user_id) {
            throw new Error("User ID is required.");
        }

        const quiz = await milestone_repository.get_all_quiz_for_solved_milestone(milestone_id, user_id);

        return quiz;
    } catch (err) {
        throw err;
    }
}


const submit_quiz = async (milestone_id, quiz_id, user_id, answers) => {
    try {
        if (!quiz_id) {
            throw new Error("Quiz ID is required.");
        }

        if (!user_id) {
            throw new Error("User ID is required.");
        }

        if (!answers) {
            throw new Error("Answers are required.");
        }

        if (!milestone_id) {
            throw new Error("Milestone ID is required.");
        }

        const data = await milestone_repository.submit_quiz(milestone_id, quiz_id, user_id, answers);

        return data;
    } catch (err) {
        throw err;
    }
}


module.exports = {
    get_milestone_by_id,
    mark_milestone_as_complete,
    submit_quiz,
    get_random_quiz_for_unsolved_milestone,
    get_all_quiz_for_solved_milestone
}