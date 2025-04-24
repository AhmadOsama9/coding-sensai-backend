const course_service = require("../services/course_service");


const get_all_courses = async (req, res) => {
    try {
        console.log("get_all_courses");
        const courses = await course_service.get_all_courses();

        res.status(200).json(courses);

    } catch (error) {
        console.error("Error in get_all_courses: ", error);
        res.status(500).send({ error: error.message });
    }
}

const get_course_overview = async (req, res) => {
    try {
        const { course_id } = req.params;
        const course_overview = await course_service.get_course_overview(course_id);

        console.log("course_overview: ", course_overview);
        res.status(200).json(course_overview);

    } catch (error) {
        console.error("Error in get_course_overview: ", error);
        res.status(500).send({ error: error.message });
    }
}

const get_user_full_course_and_topic_data = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { course_id } = req.params;
        const courseData = await course_service.get_user_full_course_and_topic_data(course_id, user_id);

        console.log("User full courseData: ", courseData);

        res.status(200).json(courseData);

    } catch (error) {
        console.error("Error in get_full_course_and_topic_data: ", error);
        res.status(500).send({ error: error.message });
    }
}

const get_full_course_and_topic_data = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { course_id } = req.params;

        console.log("user_id: ", user_id);

        const courseData = await course_service.get_full_course_and_topic_data(course_id, user_id);
    

        console.log("full courseData: ", courseData);

        res.status(200).json(courseData);

    } catch (error) {
        console.error("Error in get_full_course_and_topic_data: ", error);
        res.status(500).send({ error: error.message });
    }
}

const get_user_enrolled_courses = async (req, res) => {
    try {
        console.log("get_started_courses");
        const { user_id } = req.user;
        const courses = await course_service.get_user_enrolled_courses(user_id);

        res.status(200).json(courses);

    } catch (error) {
        console.error("Error in get_started_courses: ", error);
        res.status(500).send({ error: error.message });
    }
}

const enroll_user_in_course = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { course_id } = req.params;
        await course_service.enroll_user_in_course(user_id, course_id);

        res.status(200).send("User course progress initialized");
    } catch (error) {
        console.error("Error in initialize_user_course_progress: ", error);
        res.status(500).send({ error: error.message });
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

