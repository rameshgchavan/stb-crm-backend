// Import mongoose
const mongoose = require("mongoose");

// Create Schema
const planSchema = new mongoose.Schema({
    PlanName: String,
    MRP: Number,
    CustomMRP: Number,
    LCOPrice: Number,
    BCPrice: Number,
    SDCount: Number,
    HDCount: Number
});

// Export schema
module.exports = planSchema;