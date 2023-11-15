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
// HTTP request post method to get transactions
TransactionsRoutes.route("/").post(TokenVerification, async (req, res) => {
    const { dbName, collectionName, acNo } = req.body;

    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    const TransactionsModel = connection.models[collectionName]
        || connection.model(collectionName, TransactionsSchema);

    acNo ? res.send(await TransactionsModel.find({ AcNo: acNo }))
        : res.send(await TransactionsModel.find());
})

// HTTP request post method to get recharged stb count 
TransactionsRoutes.route("/rcstbcount").post(TokenVerification, async (req, res) => {
    const monthsList = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];

    let rcSTBCount = [];

    const { dbName, ofYear } = req.body;

    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    for (let i = 0; i < monthsList.length; i++) {
        const TransactionsModel = connection.models[`${monthsList[i]}-${ofYear}`]
            || connection.model(`${monthsList[i]}-${ofYear}`, TransactionsSchema);

        rcSTBCount.push(await TransactionsModel.count({
            $and: [
                {
                    $or: [
                        { PlanType: "Basic" },
                        { PlanType: "Hathway Bouquet" }
                    ]
                },
                { TransactionType: { $ne: "Cancellation" } }
            ]
        })
        )
    }

    res.send(rcSTBCount);
})

// Export Router
module.exports = TransactionsRoutes;