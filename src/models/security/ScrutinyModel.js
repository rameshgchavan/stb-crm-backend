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
    // Check if user approved or not
    if (isEmail.Status!="approved") {
        return {
            code: 102, //Processing
            message: "Approval pending."
        }
    }
    //Successful scrutiny
    return {
        code: 200,
        message: "Ok."
    }
}

module.exports = Scrutiny