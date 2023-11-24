// Import mongoose
const customerSchema = require("../schemas/customerSchema");
const mongoDBConnection = require("../connection/mongoDBConnection");

const customersModel = (dbName) => {
    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    return (
        connection.models["Customers-Details"]
        || connection.model("Customers-Details", customerSchema)
    )
    // "Customers-Details" is collections name
}

// Export function
module.exports = customersModel

// Note: mongoose model convert the collection name to lower case and
// if the collection name is singular it convert to plural.
// e.g Customers-Detail >> Customers-Details