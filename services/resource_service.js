const resource_repository = require("../repositories/resource_repository");

const get_resource_by_topic_id = async (topic_id) => {
    try {
        if (!topic_id) {
            throw new Error("Topic ID is required.");
        }

        const resources = await resource_repository.fetch_resource_by_topic_id(topic_id);

        return resources;
    } catch (err) {
        throw err;
    }
}


module.exports = {
    get_resource_by_topic_id
}