// Import express
const express = require("express");
const dotEnv = require("dotenv");
const jwt = require("jsonwebtoken");

// Import Scrutiny Model
const Scrutiny = require("../models/security/ScrutinyModel");
// Import TokenVerification Model
const TokenVerification = require("../models/security/TokenVerificationModel");

// Import Users Schema Model
const UsersModel = require("../models/UsersModel")

// Environment setting
dotEnv.config();
const JWTKEY = process.env.JWTKEY

// Create Router object
const UsersRoutes = express.Router();

// (APIs) downwards
// HTTP request post method to get users
UsersRoutes.route("/").post(TokenVerification, async (req, res) => {
    // Destruct request body
    const { Admin, Email } = req.body.user;

    if (Admin == "stb-crm") {
        res.send(await UsersModel.find().select("Admin Status Name"));
    }
    else if (Admin == "self") {
        res.send(await UsersModel.find({ Admin: Email.replace(".", "-") }).select("Admin Status Name"));
    }
    else { res.send({ code: 401, message: "Unauthorized" }); }
})

// HTTP request put method to update users
UsersRoutes.route("/update").put(TokenVerification, async (req, res) => {
    // Destruct request body
    const { id, object } = req.body;
    // Restrict to update Name or Status only
    const key = Object.keys(object)[0];
    if (key == "Name" || key == "Status") {
        // Find by id and update obeject of document in collection
        await UsersModel.findOneAndUpdate({ _id: id }, object)
            .then(res.send({
                code: 202,
                message: `Accepted successfully.`
            }));
    }
})

// HTTP request post method to check email exsists or not
UsersRoutes.route("/isemail").post(async (req, res) => {
    // Scrutinize Email
    const scrutiny = await Scrutiny(req.body);
    // If not email exsist
    if (scrutiny.code == 404) {
        res.send(scrutiny)
    }
    else {
        res.send({
            code: 200,
            message: "Ok"
        })
    }
})

// HTTP request post method to signup
UsersRoutes.route("/signup").post(async (req, res) => {
    // Scrutinize Email
    const scrutiny = await Scrutiny(req.body);

    if (scrutiny.code == 404) {
        // Save data (record) received in body to database and retun 201 response with message.
        await UsersModel(req.body).save()
            .then(res.send({
                code: 201,
                message: `Created successfully.`
            }));
    }
})

// HTTP request post method to login
UsersRoutes.route("/login").post(async (req, res) => {
    // Scrutinize Email and password
    const scrutiny = await Scrutiny(req.body);

    if (scrutiny.code == 200) {
        // Find autheticated user 
        const user = await UsersModel.findOne(req.body).select('-Password -_id');
        // Create token to secure routes and send it into response
        jwt.sign({}, JWTKEY, { expiresIn: "1h" }, (err, token) => {
            if (err) { res.send(err) }
            else {
                res.send({ ...user._doc, ...{ token } }); // Merged objects using ... (spread operator)
            }
        });
    }
    else { res.send(scrutiny); }
});

// HTTP request put method to reset password
UsersRoutes.route("/resetpass").put(async (req, res) => {
    // Scrutinize Email
    const scrutiny = await Scrutiny(req.body);
    //Change password if old password matched or not matched
    if (scrutiny.code == 200 || scrutiny.code == 403) {
        // Find email and update the password regarding that email and retun 202 response with message.
        await UsersModel.findOneAndUpdate({ Email: req.body.Email }, { Password: req.body.Password })
            .then(res.send({
                code: 202,
                message: `Accepted successfully.`
            }));
    }
});

// Export Router
module.exports = UsersRoutes;