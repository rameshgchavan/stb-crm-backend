// Import mongoose
const mongoose = require("mongoose");

// Create Schema
const UsersSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Password: String,
    Admin: Boolean,
    Approved: Boolean,
    AreaManager: String,
    LastLogin: String
});

// Export Model
module.exports = mongoose.model("Users", UsersSchema); // "Users" is collections name

// Note: mongoose model convert the collection name to lower case and 
// if the collection name is singular it convert to plural.
// e.g User >> users