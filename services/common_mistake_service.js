const common_mistake_repository = require("../repositories/common_mistake_repository");

const get_common_mistake_by_id = async (mistake_id) => {
    try {
        if (!mistake_id) {
            throw new Error("Mistake ID is required.");
        }

        const mistake = await common_mistake_repository.get_common_mistake_by_id(mistake_id);

        return mistake;
    } catch (err) {
        throw err;
    }
}


const mark_common_mistake_as_complete = async (mistake_id, user_id) => {
    try {
        if (!mistake_id) {
            throw new Error("Mistake ID is required.");
        }

        if (!user_id) {
            throw new Error("User ID is required.");
        }

        const completion_status = await common_mistake_repository.mark_mistake_as_completed(mistake_id, user_id);

        return completion_status;
    } catch (err) {
        throw err;
    }
}

const get_random_quiz_for_unsolved_mistake = async (mistake_id, user_id) => {
    try {
        if (!mistake_id) {
            throw new Error("Mistake ID is required.");
        }

        if (!user_id) {
            throw new Error("User ID is required.");
        }

        const quiz = await common_mistake_repository.get_random_quiz_for_unsolved_mistake(mistake_id, user_id);

        return quiz;
    } catch (err) {
        throw err;
    }
}

const get_all_quiz_for_solved_mistake = async (mistake_id, user_id) => {
    try {
        if (!mistake_id) {
            throw new Error("Mistake ID is required.");
        }

        if (!user_id) {
            throw new Error("User ID is required.");
        }

        const quiz = await common_mistake_repository.get_all_quiz_for_solved_mistake(mistake_id, user_id);

        return quiz;
    } catch (err) {
        throw err;
    }
}


const submit_mistake_quiz = async (mistake_id, quiz_id, user_id, answers) => {
    try {
        if (!mistake_id) {
            throw new Error("Mistake ID is required.");
        }

        if (!quiz_id) {
            throw new Error("Quiz ID is required.");
        }

        if (!user_id) {
            throw new Error("User ID is required.");
        }

        if (!answers) {
            throw new Error("Answers are required.");
        }

        const quiz = await common_mistake_repository.submit_quiz_for_mistake(mistake_id, quiz_id, user_id, answers);

        return quiz;
    } catch (err) {
        throw err;
    }
}



module.exports = {
    get_common_mistake_by_id,
    mark_common_mistake_as_complete,
    get_random_quiz_for_unsolved_mistake,
    get_all_quiz_for_solved_mistake,
    submit_mistake_quiz
}