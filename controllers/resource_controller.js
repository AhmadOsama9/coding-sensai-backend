const resource_service = require("../services/resource_service");


const get_resource_by_topic_id = async (req, res) => {
    try {
        const { topic_id } = req.params;
        const resources = await resource_service.get_resource_by_topic_id(topic_id);

        return res.status(200).json(resources);
    } catch (error) {
        console.error("Error in get_resource_by_topic_id: ", error);
        return res.status(500).send({ error: error.message });
    }
}

module.exports = {
    get_resource_by_topic_id
}