const course_repository = require("../repositories/course_repository");


const get_all_courses = async () => {
    try {
        return await course_repository.get_all_courses();
    } catch (err) {
        throw err;
    }
}

const get_course_overview = async (course_id) => {
    try {
        if (!course_id) {
            throw new Error("Course ID is required.");
        }

        // Parse course_id into an integer
        const parsedCourseId = parseInt(course_id, 10);
        if (isNaN(parsedCourseId)) {
            throw new Error("Invalid Course ID: must be an integer.");
        }

        const topics = await course_repository.get_course_overview(parsedCourseId);

        // Return an empty array if no topics are found
        if (!topics || topics.length === 0) {
            return [];
        }

        return topics;
    } catch (err) {
        throw err;
    }
}

const get_user_full_course_and_topic_data = async (course_id, user_id) => {
    try {
        if (!course_id || !user_id) {
            throw new Error("Course ID and User ID are required.");
        }

        const courseData = await course_repository.get_user_full_course_and_topic_data(course_id, user_id);

        return courseData;

    } catch (err) {
        throw err;
    }

}

const get_full_course_and_topic_data = async (course_id, user_id) => {
    try {
        if (!course_id || !user_id) {
            throw new Error("Course ID is required.");
        }

        const courseData = await course_repository.get_full_course_and_topic_data(course_id, user_id);

        return courseData;

    } catch (err) {
        throw err;
    }
}

const get_user_enrolled_courses = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error("User ID is required.");
        }

        const courses = await course_repository.get_user_enrolled_courses(user_id);

        return courses;
    } catch (err) {
        throw err;
    }
}


const enroll_user_in_course = async (user_id, course_id) => {
    try {
        if (!user_id || !course_id) {
            throw new Error("User ID and Course ID are required.");
        }

        const result = await course_repository.enroll_user_in_course(user_id, course_id);

        return result;
    } catch (err) {
        throw err;
    }
}


module.exports = {
    get_all_courses,
    get_course_overview,
    get_full_course_and_topic_data,
    get_user_full_course_and_topic_data,
    get_user_enrolled_courses,
    enroll_user_in_course
};
