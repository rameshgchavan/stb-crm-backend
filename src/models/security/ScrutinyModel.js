// Import UsersModel schema
const UsersModel = require("../UsersModel")

// Fuction to verify authenticattion
const Scrutiny = async (reqBody) => {
    // Destruct request body
    const { Email, Password } = reqBody;
    // Find email in database
    const isEmail = await UsersModel.findOne({ Email });
    // If not email exsist
    if (!isEmail) {
        return {
            code: 404,
            message: `${Email} not found`
        }
    }
    // If not password not matched
    if (isEmail.Password != Password) {
        return {
            code: 403,
            message: "Forbidden password"
        }
    }
    // Check if user approval pening
    if (isEmail.Status == "pending") {
        return {
            code: 102, //Processing
            message: "Approval pending."
        }
    }
    // Check if user blocked
    if (isEmail.Status == "blocked") {
        return {
            code: 401, //Unauthorized
            message: "Blocked."
        }
    }
    //Successful scrutiny
    return {
        code: 200,
        message: "Ok."
    }
}

module.exports = Scrutiny