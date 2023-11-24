const mongoose = require("mongoose");
const dotEnv = require("dotenv");

// Environment setting
dotEnv.config();
const connectionString = `${process.env.MONGODB_URL}`;

// Create connection
const MongoDbConnection = mongoose.createConnection(
    connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

MongoDbConnection.on("connected", () => {
    console.log("Connection established successfully.");
});

MongoDbConnection.on("error", (err) => {
    console.log(`Connection failed, error: ${err}`);
});

module.exports = MongoDbConnection;