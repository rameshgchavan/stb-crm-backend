// Import express
const express = require("express");

// Import UsersModel.js
const UsersModel = require("../models/UsersModel")

// Create Router object
const UsersRoutes = express.Router();

// (APIs) downwards
// HTTP request get method to get users
UsersRoutes.route("/").get(async (req, res) => {
    res.send(await UsersModel.find().select("-Password"));
})

// HTTP request post method to login
UsersRoutes.route("/login").post(async (req, res) => {
    // Find Email and return password only
    const user = await UsersModel.findOne({ Email: req.body.Email }).select('Password');

    // Check if not Email exsist then retun 404 response code with message
    if (!user) {
        res.send({
            code: 404,
            message: `${req.body.Email} is not found.`
        })

        return
    }

    // Check password from database and password from body are matching 
    // If not then retun 403 response code with message
    if (user.Password !== req.body.Password) {
        res.send({
            code: 403,
            message: `Forbidden.`
        })

        return
    }
    // If matching then retun response with data (record) without password and _id
    else { res.send(await UsersModel.findOne(req.body).select('-Password -_id')); }
})

// HTTP request post method to check mail exsist or not
UsersRoutes.route("/isemail").post(async (req, res) => {
    // Find Email and return email only
    const user = await UsersModel.findOne({ Email: req.body.Email }).select('Email');

    // Check if Email exsist then retun 200 response code else 404 response code with message.
    user ? res.send({
        code: 200,
        message: `${user.Email} is found.`
    })
        : res.send({
            code: 404,
            message: `${req.body.Email} not found.`
        });
})

// HTTP request post method to signup
UsersRoutes.route("/signup").post(async (req, res) => {
    // Save data (record) received in body to database and retun 201 response with message.
    await UsersModel(req.body).save()
        .then(res.send({
            code: 201,
            message: `Created successfully.`
        }));
})

// HTTP request put method to reset password
UsersRoutes.route("/resetpass").put(async (req, res) => {
    // Find email and update the password regarding that email and retun 202 response with message.
    await UsersModel.findOneAndUpdate({ Email: req.body.Email }, { Password: req.body.Password })
        .then(res.send({
            code: 202,
            message: `Accepted successfully.`
        }));
})

// Export Router
module.exports = UsersRoutes;