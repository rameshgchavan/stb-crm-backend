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

// HTTP request post method to get recharged stbs A/c No. 
TransactionsRoutes.route("/rcstbacno").post(TokenVerification, async (req, res) => {
    const monthsList = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];

    let rcSTBsAcNo = [];

    const { dbName, ofYear } = req.body;

    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    for (let i = 0; i < monthsList.length; i++) {
        const TransactionsModel = connection.models[`${monthsList[i]}-${ofYear}`]
            || connection.model(`${monthsList[i]}-${ofYear}`, TransactionsSchema);

        rcSTBsAcNo.push(await TransactionsModel.find({
            $and: [
                {
                    $or: [
                        { PlanType: "Basic" },
                        { PlanType: "Hathway Bouquet" }
                    ]
                },
                { TransactionType: { $ne: "Cancellation" } }
            ]
        }).select("AcNo -_id")
        )
    }

    res.send(rcSTBsAcNo);
})

// Export Router
module.exports = TransactionsRoutes;