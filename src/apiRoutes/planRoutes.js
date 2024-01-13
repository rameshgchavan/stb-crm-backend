// Import express
const express = require("express");
const csvtojson = require("convert-csv-to-json");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public")
    },
    filename: function (req, file, cb) {
        return cb(null, "Plans.csv")
    }
});

const upload = multer({ storage });

// Import mongoose
const mongoose = require("mongoose");

// Import tokenVerification Model
const tokenVerification = require("../functions/tokenVerificationModel");

// Import Plan Model function
const planModel = require("../models/planModel");

// Create Router object
const planRoutes = express.Router();

// (APIs) downwards
// HTTP request get method to get plans
planRoutes.route("/").get(tokenVerification, async (req, res) => {
    const { dbname } = req.headers;

    const PlanModel = planModel(dbname)
    res.send(await PlanModel.find());
})

// HTTP request post method to save
planRoutes.route("/save").post(tokenVerification, async (req, res) => {
    const { dbName, planData } = req.body;

    const PlanModel = planModel(dbName);

    // Save data (record) received in body to database and retun 201 response with message.
    PlanModel(planData).save()
        .then(() => {
            res.send({
                code: 201,
                message: `Saved successfully.`
            });
        })
        .catch(err => {
            res.send({
                code: 302, //Found
                message: err
            });
        });
});

// HTTP request put method to update
planRoutes.route("/update").put(tokenVerification, (req, res) => {
    const { dbName, planName, planData } = req.body;

    const PlanModel = planModel(dbName);

    // Find param id in database and update document received in body
    // and then send respose
    PlanModel.findOneAndUpdate({ PlanName: planName }, planData)
        .then(
            res.send({
                code: 202,
                message: `Updated successfully.`
            })
        )
        .catch(err => {
            res.send({
                code: 300,
                message: err
            })
        });
});

// API to convert csv file to json and save data
planRoutes.route("/upload").post(tokenVerification, upload.single('csvFile'), async (req, res) => {
    const { dbname } = req.headers;
    const { fileData } = req.body;

    const PlanModel = planModel(dbname);

    const plansDataFromDB = await PlanModel.find();

    // Compare existing data with new data. If not found then save
    // const plansDataFromFile = await csvtojson.fieldDelimiter(',').getJsonFromCsv("./public/Plans.csv")
    const plansDataFromFile = fileData.filter(filters =>
        // some method works like includes but on values not reference
        !plansDataFromDB.some(somes => somes.PlanName == filters.PlanName)
    );

    // Add custome MRP field
    const plansData = plansDataFromFile
        .map((customers) => {
            return { ...customers, CustomMRP: 0 }
        });

    // Save/insert filterd data to database
    PlanModel.insertMany(plansData)
        .then(() => {
            res.send({
                code: 201,
                message: plansData?.length == 0
                    ? "Everythig is up to date."
                    : `${plansData?.length} Plans uploaded successfully.`
            });
        })
        .catch(err => {
            res.send({
                code: 300,
                message: `Error: ${err}`
            });
        })
});

// API to send Bulk Plans.xlsx file to client
planRoutes.route("/download").post(tokenVerification, async (req, res) => {
    res.download("./public/sample/Bulk Plans.xlsx")
});

// Export Router
module.exports = planRoutes;