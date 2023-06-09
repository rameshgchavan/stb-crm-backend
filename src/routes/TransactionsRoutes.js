// Import express
const express = require("express");
// Import mongoose
const mongoose = require("mongoose");

// Import TokenVerification Model
const TokenVerification = require("../models/security/TokenVerificationModel");

// Import Transactions Schema
const TransactionsSchema = require("../models/TransactionsModel");

// Create Router object
const TransactionsRoutes = express.Router();

// (APIs) downwards
// HTTP request get method to get transactions
TransactionsRoutes.route("/:collectionName").post(TokenVerification, async (req, res) => {
    const { collectionName } = req.params;

    const TransactionsModel = mongoose.models[collectionName]
        || mongoose.model(collectionName, TransactionsSchema)

    req.body.acNo
        ? res.send(await TransactionsModel.find({ AcNo: req.body.acNo }))
        : res.send(await TransactionsModel.find())
})

// Export Router
module.exports = TransactionsRoutes;