// Import mongoose
const mongoose = require("mongoose");

const mongoDBConnection = require("../MongoDBConnection");
const connection = mongoDBConnection.useDb("stb-crm", { useCache: true });


// Create Schema
const UsersSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Password: String,
    Admin: String,
    Status: String,
    LastLogin: String
});

// Export Model
module.exports = connection.model("Users", UsersSchema); // "Users" is collections name

// Note: mongoose model convert the collection name to lower case and
// if the collection name is singular it convert to plural.
// e.g User >> users