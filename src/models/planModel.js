// Import mongoose
const planSchema = require("../schemas/planSchema");
const mongoDBConnection = require("../dbConnection/mongoDbConnection");

const planModel = (dbName) => {
    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    return (
        connection.models["Plans-Details"]
        || connection.model("Plans-Details", planSchema)
    )
    // "Plans-Details" is collections name
}

// Export function
module.exports = planModel

// Note: mongoose model convert the collection name to lower case and
// if the collection name is singular it convert to plural.
// e.g Plans-Detail >> Plans-Details