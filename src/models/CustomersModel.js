// Import mongoose
const mongoose = require("mongoose");

const mongoDBConnection = require("../MongoDBConnection");
const connection = mongoDBConnection.useDb("stb-crm", { useCache: true });

// Create Schema
const CustomersSchema = new mongoose.Schema({
    AcNo: String,
    Address: String,
    Area: String,
    AreaManager: String,
    AreaPerson: String,
    CustDate: String,
    CustName: String,
    LCOCode: String,
    MobNo: String,
    NDS_No: String,
    Origin: String,
    Remark: String,
    SD_HD: String,
    STBLocation: String,
    STBState: String,
    STBStatus: String,
    STB_SN: String,
    STBs: String,
    SeedType: String,
    VC_NDS_MAC_ID: String
});

// Export schema
module.exports = CustomersSchema;
 // Customers-details is collections name

// Note: mongoose model convert the collection name to lower case and
// if the collection name is singular it convert to plural.
// e.g User >> users