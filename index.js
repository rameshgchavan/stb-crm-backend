// Import express and middlewares
const express = require("express");
const dotEnv = require("dotenv");
// const cors = require("cors");

// Import Routes
const usersRoutes = require("./src/routes/userRoutes");
const customersRoutes = require("./src/routes/customerRoutes");
const transactionsRoutes = require("./src/routes/transactionRoutes");

// Create object of express
const app = express();

// Use middlewares and routes in express
// app.use(cors());
app.use(express.json());
app.use("/users", usersRoutes);
app.use("/customers", customersRoutes);
app.use("/transactions", transactionsRoutes);

//Run frontend
app.use(express.static('./client/build')); //Note: Copy build folder of frontend and paste it into backend

// Environment setting
dotEnv.config();
const PORT = process.env.PORT;

app.listen(PORT || 8080, () => {
    try {
        console.log("Server is listening on Port: " + PORT);
    }
    catch (err) {
        console.log("Connection failed for reason: " + err);
    }
})