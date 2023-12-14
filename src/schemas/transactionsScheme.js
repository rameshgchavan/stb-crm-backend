// Import mongoose
const mongoose = require("mongoose");

// Create Schema
const transactionsScheme = new mongoose.Schema({
    yearMonth: String,
    data: Object
})

// Export Schema
module.exports = transactionsScheme;