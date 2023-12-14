// Import mongoose
const customerPackageSchema = require("../schemas/customerPackageScheme");
const mongoDBConnection = require("../connection/mongoDbConnection");


const customerPackageModel = (dbName, collectionName) => {
    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    return (
        connection.models[collectionName]
        || connection.model(collectionName, customerPackageSchema)
    )
}

// Export function
module.exports = customerPackageModel;