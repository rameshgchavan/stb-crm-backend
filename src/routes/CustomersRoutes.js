// Import express
const express = require("express");
// Import mongoose
const mongoose = require("mongoose");

// Import TokenVerification Model
const TokenVerification = require("../models/security/TokenVerificationModel");

// Import mongoDB Connection
const mongoDBConnection = require("../MongoDBConnection");

// Import Customers Schema
const CustomersSchema = require("../models/CustomersModel")

// Create Router object
const CustomersRoutes = express.Router();

// (APIs) downwards
// HTTP request get method to get customers
CustomersRoutes.route("/:dbName").get(TokenVerification, async (req, res) => {
    const { dbName } = req.params;

    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    const CustomersModel = connection.models["Customers-Details"]
        || connection.model("Customers-Details", CustomersSchema)

    res.send(await CustomersModel.find());
})

// HTTP request post method to save
CustomersRoutes.route("/save").post(TokenVerification, async (req, res) => {
    const { dbName, customerData } = req.body;

    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    const CustomersModel = connection.models["Customers-Details"]
        || connection.model("Customers-Details", CustomersSchema)

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
CustomersRoutes.route("/update/:id").put(TokenVerification, async (req, res) => {
    // get id from path
    const paramId = req.params.id;
    // get id and status from body
    const { _id, STBStatus: status } = req.body.customerData;
    // Convert text to Object Id
    const bodyId = new mongoose.Types.ObjectId(_id);

    // get dbName from body
    const { dbName, customerData } = req.body;

    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    const CustomersModel = connection.models["Customers-Details"]
        || connection.model("Customers-Details", CustomersSchema)

    const saveDelete = async (bodyData, action) => {
        // Save document which is bodyData and then
        // Delete document which id is equal to param id 
        // and then send respose

        await CustomersModel.deleteOne({ _id: paramId })
            .then(
                await CustomersModel(bodyData).save()
                    .then(
                        res.send({
                            code: 202,
                            message: `${action} successfully.`
                        })
                    )
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
module.exports = CustomersRoutes;