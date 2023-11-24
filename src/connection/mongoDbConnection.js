const mongoose = require("mongoose");
const dotEnv = require("dotenv");

// Environment setting
dotEnv.config();
const connectionString = `${process.env.MONGODB_URL}`;

// Create connection
const mongoDbConnection = mongoose.createConnection(
    connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoDbConnection.on("connected", () => {
    console.log("Connection established successfully.");
});

mongoDbConnection.on("error", (err) => {
    console.log(`Connection failed, error: ${err}`);
});

module.exports = mongoDbConnection;