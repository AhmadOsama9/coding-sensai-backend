const code_example_service = require("../services/code_example_service");

const get_code_by_id = async (req, res) => {
    try {
        const { code_id } = req.params;
        const code = await code_example_service.get_code_by_id(code_id);

        return res.status(200).json(code);
    } catch (error) {
        console.error("Error in get_code_by_id: ", error);
        return res.status(500).send({ error: error.message });
    }
}


module.exports = {
    get_code_by_id
}