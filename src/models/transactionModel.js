// Import mongoose
const transactionSchema = require("../schemas/transactionScheme");
const mongoDBConnection = require("../connection/mongoDbConnection");

const transactionModel = (dbName, collectionName) => {
    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    return (
        connection.models[collectionName]
        || connection.model(collectionName, transactionSchema)
    )
}

// Export function
module.exports = transactionModel;