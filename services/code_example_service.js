const code_example_repository = require("../repositories/code_example_repositories");

const get_code_by_id = async (code_id) => {
    try {
        if (!code_id) {
            throw new Error("Code ID is required.");
        }

        const code = await code_example_repository.get_code_by_id(code_id);

        return code;
    } catch (err) {
        throw err;
    }
}


module.exports = {
    get_code_by_id
}