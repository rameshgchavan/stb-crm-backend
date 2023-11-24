// Import mongoose
const mongoose = require("mongoose");

// Create Schema
const transactionSchema = new mongoose.Schema({
    DateAcNo: String,
    TransactionDateTime: Date,
    ExpiryDate: Date,
    Priority: Number,
    PlanType: String,
    TransactionType: String,
    AcNo: String,
    PlanName: String,
    BasePrice: Number,
    LCOPrice: Number,
    SDCount: Number,
    HDCount: Number,
    NCF: Number,
    CustomerID: String
});

// Export Schema
module.exports = transactionSchema;