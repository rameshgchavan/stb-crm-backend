// Import express
const express = require("express");

// Import UsersModel.js
const UsersModel = require("../models/UsersModel")

// Create Router object
const UsersRoutes = express.Router();

// HTTP request methods (APIs) downwards
UsersRoutes.route("/").get(async (req, res) => {
    res.send(await UsersModel.find());
})

UsersRoutes.route("/login").post(async (req, res) => {
    res.send(await UsersModel.findOne(req.body).select('-Password -_id'));
})

UsersRoutes.route("/signup").post(async (req, res) => {
    res.send(await UsersModel(req.body).save());
})

// Export Router
module.exports= UsersRoutes;