// Import express
const express = require("express");

// Import tokenVerification Model
const tokenVerification = require("../functions/tokenVerificationModel");

// Import Transactions Model function
const transactionModel = require("../models/transactionModel");

// Create Router object
const transactionRoutes = express.Router();

// (APIs) downwards
// HTTP request post method to get transactions
transactionRoutes.route("/").post(tokenVerification, async (req, res) => {
    const { dbName, collectionName, acNo } = req.body;

    const TransactionModel = transactionModel(dbName, collectionName);

    acNo ? res.send(await TransactionModel.find({ AcNo: acNo }))
        : res.send(await TransactionModel.find());
})

// HTTP request post method to get recharged stbs A/c No. 
transactionRoutes.route("/rcstbacno").post(tokenVerification, async (req, res) => {
    const monthsList = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];

    let rcSTBsAcNo = [];

    const { dbName, ofYear } = req.body;

    for (let i = 0; i < monthsList.length; i++) {
        const collectionName = `${monthsList[i]}-${ofYear}`;
        const TransactionModel = transactionModel(dbName, collectionName);

        rcSTBsAcNo.push(await TransactionModel.find({
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
module.exports = transactionRoutes;