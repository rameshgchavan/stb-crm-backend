// Import express and middlewares
const express = require("express");
const dotEnv = require("dotenv");
// const cors = require("cors");

// Import Routes
const UsersRoutes = require("./src/routes/UsersRoutes");
const CustomersRoutes = require("./src/routes/CustomersRoutes");
const TransactionsRoutes = require("./src/routes/TransactionsRoutes");


// Create object of express
const app = express();

// Use middlewares and routes in express
// app.use(cors());
app.use(express.json());
app.use("/users", UsersRoutes);
app.use("/customers", CustomersRoutes);
app.use("/transactions", TransactionsRoutes);

const options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
    index: ['index.html'],
    maxAge: '1m',
    redirect: false
  }

//Run frontend
app.use(express.static('./client/build',options)); //Note: Copy build folder of frontend and paste it into backend

// Environment setting
dotEnv.config();
const PORT = process.env.PORT;


app.listen(PORT || 8080, () => {
    try {
        console.log("Connection established. Server is running on Port: " + PORT);
    }
    catch (err) {
        console.log("Connection failed for reason: " + err);
    }
})