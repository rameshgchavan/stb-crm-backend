// Import mongoose
const mongoose = require("mongoose");

// Create Schema
const transactionsSchema = new mongoose.Schema({
    yearMonth: String,
    data: Object
})

// Export Schema
module.exports = transactionsSchema;