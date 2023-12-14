// Import mongoose
const mongoose = require("mongoose");

// Create Schema
const userSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Password: String,
    Admin: String,
    Status: String,
    LastLogin: String,
    BulkTransactions: Boolean
});

// Export Schema
module.exports = userSchema; 