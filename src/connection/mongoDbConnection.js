const mongoose = require("mongoose");
const dotEnv = require("dotenv");

// Environment setting
dotEnv.config();
const connectionString = `${process.env.MONGODB_URL}`;

// Create connection
const mongoDBConnection = mongoose.createConnection(
    connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoDBConnection.on("connected", () => {
    console.log("Connection established successfully.");
});

mongoDBConnection.on("error", (err) => {
    console.log(`Connection failed, error: ${err}`);
});

module.exports = mongoDBConnection;