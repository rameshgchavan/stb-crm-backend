// Import express
const express = require("express");
const csvtojson = require("convert-csv-to-json");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public")
    },
    filename: function (req, file, cb) {
        return cb(null, "Customers.csv")
    }
});

const upload = multer({ storage });

// Import mongoose
const mongoose = require("mongoose");

// Import tokenVerification Model
const tokenVerification = require("../functions/tokenVerificationModel");

// Import Customers Model function
const customerModel = require("../models/customerModel");

// Create Router object
const customerRoutes = express.Router();

// (APIs) downwards
// HTTP request get method to get customers
customerRoutes.route("/:dbName").get(tokenVerification, async (req, res) => {
    const { dbName } = req.params;

    const CustomerModel = customerModel(dbName)
    res.send(await CustomerModel.find());
})

// HTTP request post method to save
customerRoutes.route("/save").post(tokenVerification, async (req, res) => {
    const { dbName, customerData } = req.body;

    const CustomerModel = customerModel(dbName);

    // Save data (record) received in body to database and retun 201 response with message.
    try {
        await CustomerModel(customerData).save();

        res.send({
            code: 201,
            message: `Saved successfully.`
        });
    }
    catch (err) {
        res.send({
            code: 302, //Found
            message: err
        });
    }

});

// API to convert csv file to json and save data
customerRoutes.route("/upload").post(tokenVerification, upload.single('csvFile'), async (req, res) => {
    const { dbname } = req.headers;

    const CustomerModel = customerModel(dbname);

    const customersDataFromDB = await CustomerModel.find();

    // Compare existing data with new data. If not found then save
    const customersDataFromFile = await csvtojson.fieldDelimiter(',').getJsonFromCsv("./public/Customers.csv")
        .filter(filters =>
            // some method works like includes but on values not reference
            !customersDataFromDB.some(somes => somes.AcNo == filters.AcNo)
        );

    // Add custome object id (_id) field
    const customersData = customersDataFromFile
        .map((customers) => {
            const id = new mongoose.Types.ObjectId(`ac${customers.AcNo}`)
            return { ...customers, _id: id }
        });


    // Save/insert filterd data to database
    CustomerModel.insertMany(customersData)
        .then(() => {
            res.send({
                code: 201,
                message: customersData?.length == 0
                    ? "Everythig is up to date."
                    : `${customersData?.length} Customers uploaded successfully.`
            });
        })
        .catch(err => {
            res.send({
                code: 300,
                message: `Error: ${err}`
            });
        })
});

// API to send Bulk Customers.xlsx file to client
customerRoutes.route("/download").post(tokenVerification, async (req, res) => {
    res.download("./public/sample/Bulk Customers.xlsx")
});

// HTTP request put method to update
customerRoutes.route("/update/:id").put(tokenVerification, async (req, res) => {
    // get id from path
    const paramId = req.params.id;
    // get id and status from body
    const { _id, STBStatus: status } = req.body.customerData;
    // Convert text to Object Id
    const bodyId = new mongoose.Types.ObjectId(_id);

    // get dbName from body
    const { dbName, customerData } = req.body;

    const CustomerModel = customerModel(dbName);

    const saveDelete = async (bodyData, action) => {
        // Save document which is bodyData and then
        // Delete document which id is equal to param id 
        // and then send respose

        await CustomerModel(bodyData).save()
            .then(async () => {
                await CustomerModel.deleteOne({ _id: paramId });

                res.send({
                    code: 202,
                    message: `${action} successfully.`
                });
            }
            )
            .catch((err) =>
                res.send({
                    code: 302, //Found
                    message: err
                })
            );
    };

    // match param id and body _id transformed from ac no
    // and status should equal to Disconnect then save the body document without _id
    if (paramId == bodyId && status == "DISCONNECT") {
        // remove _id from body data
        delete req.body.customerData._id;

        saveDelete(customerData, "Disconnected");
    }
    // if param id not matches and 
    // also status not equal to Disconnect save the body document
    else if (paramId != bodyId && status != "DISCONNECT") {
        saveDelete(customerData, "Reconnected and updated");


        // Add custome Oject id into received body
        // const bodyData = { ...(req.body), _id: bodyId }
    }
    else {
        // Find param id in database and update document received in body
        // and then send respose
        await CustomerModel.findOneAndUpdate({ _id: paramId }, customerData)
            .then(res.send({
                code: 202,
                message: `Updated successfully.`
            }));

    }
});

// Export Router
module.exports = customerRoutes;