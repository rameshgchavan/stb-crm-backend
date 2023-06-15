const mongoose = require("mongoose");
const dotEnv = require("dotenv");

// Environment setting
dotEnv.config();
const connectionString = `${process.env.MONGODB_URL}`;

// Connect to database
const mongoDBConnection = mongoose.createConnection(
    connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

module.exports = mongoDBConnection;