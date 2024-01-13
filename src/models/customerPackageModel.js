// Import mongoose
const customerPackageSchema = require("../schemas/customerPackageSchema");
const mongoDBConnection = require("../dbConnection/mongoDbConnection");


const customerPackageModel = (dbName, collectionName) => {
    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    return (
        connection.models[collectionName]
        || connection.model(collectionName, customerPackageSchema)
    )
}

// Export function
module.exports = customerPackageModel;