// Import mongoose
const transactionsScheme = require("../schemas/transactionsScheme");
const mongoDBConnection = require("../connection/mongoDbConnection");

const trasactionsModel = (dbName, collectionName) => {
    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    return (
        connection.models[collectionName]
        || connection.model(collectionName, transactionsScheme)
    )
};


// Export model
module.exports = trasactionsModel;