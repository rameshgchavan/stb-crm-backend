// Import mongoose
const transactionsSchema = require("../schemas/transactionsSchema");
const mongoDBConnection = require("../dbConnection/mongoDbConnection");

const trasactionsModel = (dbName, collectionName) => {
    const connection = mongoDBConnection.useDb(dbName, { useCache: true });

    return (
        connection.models[collectionName]
        || connection.model(collectionName, transactionsSchema)
    )
};


// Export model
module.exports = trasactionsModel;