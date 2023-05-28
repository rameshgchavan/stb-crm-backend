// Import express
const express = require("express");

// Import TokenVerification Model
const TokenVerification = require("../models/security/TokenVerificationModel");

// Import Customers Schema Model
const CustomersModel = require("../models/CustomersModel")

// Create Router object
const CustomersRoutes = express.Router();

// (APIs) downwards
// HTTP request post method to get customers
CustomersRoutes.route("/").get(TokenVerification, async (req, res) => {
    res.send(await CustomersModel.find());
})

// Export Router
module.exports = CustomersRoutes;