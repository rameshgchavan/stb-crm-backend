// Import express
const express = require("express");
// Import mongoose
const mongoose = require("mongoose");

// Import tokenVerification Model
const tokenVerification = require("../functions/tokenVerificationModel");

// Import Customers Model function
const customersModel = require("../models/customresModel");

// Create Router object
const customersRoutes = express.Router();

// (APIs) downwards
// HTTP request get method to get customers
customersRoutes.route("/:dbName").get(tokenVerification, async (req, res) => {
    const { dbName } = req.params;

    const CustomersModel = customersModel(dbName)
    res.send(await CustomersModel.find());
})

// HTTP request post method to save
customersRoutes.route("/save").post(tokenVerification, async (req, res) => {
    const { dbName, customerData } = req.body;

    const CustomersModel = customersModel(dbName);

    // Save data (record) received in body to database and retun 201 response with message.
    try {
        await CustomersModel(customerData).save();

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

// HTTP request put method to update
customersRoutes.route("/update/:id").put(tokenVerification, async (req, res) => {
    // get id from path
    const paramId = req.params.id;
    // get id and status from body
    const { _id, STBStatus: status } = req.body.customerData;
    // Convert text to Object Id
    const bodyId = new mongoose.Types.ObjectId(_id);

    // get dbName from body
    const { dbName, customerData } = req.body;
    
    const CustomersModel = customersModel(dbName);

    const saveDelete = async (bodyData, action) => {
        // Save document which is bodyData and then
        // Delete document which id is equal to param id 
        // and then send respose

        await CustomersModel(bodyData).save()
            .then(async () => {
                await CustomersModel.deleteOne({ _id: paramId });

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
        await CustomersModel.findOneAndUpdate({ _id: paramId }, customerData)
            .then(res.send({
                code: 202,
                message: `Updated successfully.`
            }));

    }
});

// Export Router
module.exports = customersRoutes;