// Import express
const express = require("express");
// Import mongoose
const mongoose = require("mongoose");



// Import TokenVerification Model
const TokenVerification = require("../models/security/TokenVerificationModel");

// Import mongoDB Connection
const mongoDBConnection = require("../MongoDBConnection");

// Import Transactions Schema
const TransactionsSchema = require("../models/TransactionsModel");

// Create Router object
const TransactionsRoutes = express.Router();

// (APIs) downwards
// HTTP request get method to get transactions
TransactionsRoutes.route("/").post(TokenVerification, async (req, res) => {
    const { dbName, collectionName, acNo } = req.body;

    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    const TransactionsModel = connection.models[collectionName]
        || connection.model(collectionName, TransactionsSchema);

    acNo ? res.send(await TransactionsModel.find({ AcNo: acNo }))
        : res.send(await TransactionsModel.find());
})

// Export Router
module.exports = TransactionsRoutes;