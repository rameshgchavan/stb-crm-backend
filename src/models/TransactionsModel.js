// Import mongoose
const mongoose = require("mongoose");

// Create Schema
const TransactionsSchema = new mongoose.Schema({
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
module.exports = TransactionsSchema; 

// Export Model
// module.exports = mongoose.model("May-2023", TransactionsSchema); // May-2023 is collections name

// Note: mongoose model convert the collection name to lower case and
// if the collection name is singular it convert to plural.
// e.g User >> users