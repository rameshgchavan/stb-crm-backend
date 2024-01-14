// Import mongoose
const mongoose = require("mongoose");

// This schema is created to handle collections: package-customers, packages-bills and statistics
const transactionsSchema = new mongoose.Schema({
    yearMonth: String,
    data: Object
})

// Export Schema
module.exports = transactionsSchema;