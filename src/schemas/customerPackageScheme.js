// Import mongoose
const mongoose = require("mongoose");

// Create Schema
const customerPackageSchema = new mongoose.Schema({
    customers: Object,
    packagesBill: Object
})

// Export Schema
module.exports = customerPackageSchema;