// Import express
const express = require("express");
const dotEnv = require("dotenv");
const jwt = require("jsonwebtoken");

// Import userScrutiny Model
const userScrutiny = require("../functions/userScrutiny");
// Import tokenVerification Model
const tokenVerification = require("../functions/tokenVerificationModel");

// Import Users Schema Model
const usersModel = require("../models/userModel")

// Environment setting
dotEnv.config();
const JWTKEY = process.env.JWTKEY

// Create Router object
const userRoutes = express.Router();

// (APIs) downwards
// HTTP request post method to get users
userRoutes.route("/").post(tokenVerification, async (req, res) => {
    // Destruct request body
    const { Admin, Email } = req.body.user;

    if (Admin == "stb-crm") {
        res.send(await usersModel.find().select("Admin Status Name LastLogin"));
    }
    else if (Admin == "self") {
        res.send(await usersModel.find({ Admin: Email.replace(".", "-") }).select("Admin Status Name"));
    }
    else { res.send({ code: 401, message: "Unauthorized" }); }
})

// HTTP request put method to update users
userRoutes.route("/update").put(tokenVerification, async (req, res) => {
    // Destruct request body
    const { id, object } = req.body;
    // Restrict to update Name or Status or LastLogin only
    const key = Object.keys(object)[0];
    if (key == "Name" || key == "Status" || key == "LastLogin") {
        // Find by id and update object of document in collection
        await usersModel.findOneAndUpdate({ _id: id }, object)
            .then(res.send({
                code: 202,
                message: `Accepted successfully.`
            }));
    }
})

// HTTP request post method to check email exsists or not
userRoutes.route("/isemail").post(async (req, res) => {
    // Scrutinize Email
    const scrutiny = await userScrutiny(req.body);
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
userRoutes.route("/signup").post(async (req, res) => {
    // Scrutinize Email
    const scrutiny = await userScrutiny(req.body);

    if (scrutiny.code == 404) {
        // Save data (record) received in body to database and retun 201 response with message.
        await usersModel(req.body).save()
            .then(res.send({
                code: 201,
                message: `Created successfully.`
            }));
    }
})

// HTTP request post method to login
userRoutes.route("/login").post(async (req, res) => {
    // Scrutinize Email and password
    const scrutiny = await userScrutiny(req.body);

    if (scrutiny.code == 200) {
        // Find autheticated user 
        const user = await usersModel.findOne(req.body).select('-Password');
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
userRoutes.route("/resetpass").put(async (req, res) => {
    // Scrutinize Email
    const scrutiny = await userScrutiny(req.body);
    //Change password if old password matched or not matched
    if (scrutiny.code == 200 || scrutiny.code == 403) {
        // Find email and update the password regarding that email and retun 202 response with message.
        await usersModel.findOneAndUpdate({ Email: req.body.Email }, { Password: req.body.Password })
            .then(res.send({
                code: 202,
                message: `Accepted successfully.`
            }));
    }
});

// Export Router
module.exports = userRoutes;