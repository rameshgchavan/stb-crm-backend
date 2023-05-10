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
    const user = await UsersModel.findOne({ Email: req.body.Email }).select('Password');

    if (!user) {
        res.send({
            code: 404,
            message: `${req.body.Email} is not found.`
        })

        return
    }

    if (user.Password !== req.body.Password) {
        res.send({
            code: 403,
            message: `Forbidden.`
        })

        return
    }
    else { res.send(await UsersModel.findOne(req.body).select('-Password -_id')); }
})

UsersRoutes.route("/isemail").post(async (req, res) => {
    const user = await UsersModel.findOne({ Email: req.body.Email }).select('-Password -_id');

    user ? res.send({
        code: 200,
        message: `${user.Email} is found.`
    })
        : res.send({
            code: 404,
            message: `${req.body.Email} not found.`
        });
})

UsersRoutes.route("/signup").post(async (req, res) => {
    await UsersModel(req.body).save()
        .then(res.send({
            code: 201,
            message: `Created successfully.`
        }));
})

UsersRoutes.route("/resetpass").put(async (req, res) => {
    await UsersModel.findOneAndUpdate({ Email: req.body.Email }, { Password: req.body.Password })
        .then(res.send({
            code: 202,
            message: `Accepted successfully.`
        }));
})

// Export Router
module.exports = UsersRoutes;