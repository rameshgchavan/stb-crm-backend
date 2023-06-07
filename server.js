// Import express and middlewares
const express = require("express");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
// const cors = require("cors");

// Import Routes
const UsersRoutes = require("./src/routes/UsersRoutes");
const CustomersRoutes = require("./src/routes/CustomersRoutes");
const TransactionsRoutes = require("./src/routes/TransactionsRoutes");

// Create object of express
const app = express();

// Environment setting
dotEnv.config();
const PORT = process.env.PORT;
const connectionString = process.env.MONGODB_URL;

// Connect to database and listen to port
mongoose.connect(
    connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(
    // Listen to port
    () => {
        app.listen(PORT, function () {
            console.log("Connection established. Server is running on Port: " + PORT);
        })
    },
    // Log error
    err => {
        console.log("Connection failed for reason: " + err);
    }
)

// Use middlewares and routes in express
// app.use(cors());
app.use(express.json());
app.use("/users", UsersRoutes);
app.use("/customers", CustomersRoutes);
app.use("/transactions", TransactionsRoutes);

//Run frontend
app.use(express.static('./client/build')); //Note: Copy build folder of frontend and paste it into backend