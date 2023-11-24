// Import mongoose
const mongoose = require("mongoose");

// Create Schema
const customerSchema = new mongoose.Schema({
    IsFree: Boolean,
    AcNo: String,
    Address: String,
    Area: String,
    AreaManager: String,
    AreaPerson: String,
    CustDate: Date,
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
module.exports = customerSchema;