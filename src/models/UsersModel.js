// Import mongoose
const userSchema = require("../schemas/userSchema");
const mongoDBConnection = require("../connection/mongoDBConnection");
const connection = mongoDBConnection.useDb("stb-crm", { useCache: true });

// Export Model
module.exports = connection.model("Users", userSchema); // "Users" is collections name

// Note: mongoose model convert the collection name to lower case and
// if the collection name is singular it convert to plural.
// e.g User >> users