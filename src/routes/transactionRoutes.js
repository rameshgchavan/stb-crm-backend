// Import express
const express = require("express");
const csvtojson = require("convert-csv-to-json");
const multer = require('multer');
const mongoDBConnection = require("../connection/mongoDbConnection");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public")
    },
    filename: function (req, file, cb) {
        return cb(null, "Transactions.csv")
    }
});

const upload = multer({ storage });

// Import tokenVerification Model
const tokenVerification = require("../functions/tokenVerificationModel");

// Import Transactions Model function
const transactionModel = require("../models/transactionModel");
const customerModel = require("../models/customerModel");
const { default: mongoose } = require("mongoose");
const { DateTime } = require("luxon");
const planModel = require("../models/planModel");
const customerPackageModel = require("../models/customerPackageModel");
const trasactionsModel = require("../models/transactionsModel");

// Create Router object
const transactionRoutes = express.Router();

// (APIs) downwards
// HTTP request post method to get transactions
transactionRoutes.route("/").post(tokenVerification, async (req, res) => {
    const { dbName, collectionName, yearMonth } = req.body;

    switch (collectionName) {
        case "statistics":
            res.send(await trasactionsModel(dbName, collectionName)
                .find({ yearMonth: { $regex: yearMonth } })
                .select("-_id yearMonth data")
                .sort({ yearMonth: "asc" })
            );
            break;

        default:
            const packagesBills = (await trasactionsModel(dbName, "packages-bills")
                .findOne({ yearMonth })
                .select("-_id data"))?.data

            const packageCustomers = (await trasactionsModel(dbName, "package-customers")
                .findOne({ yearMonth })
                .select("-_id data"))?.data

            res.send({ packagesBills, packageCustomers });
    }

    // res.send(await TransactionsModel.find({ monthYear: { $regex: statYear } })
    //     .select("-_id monthYear data")
    //     .sort({ monthYear: "asc" })
    // );
    // acNo ? res.send(await TransactionModel.find({ AcNo: acNo }))
    //     : res.send((await TransactionModel.find().select("-_id customers packagesBill"))[0]);
});

// API to convert csv file to json and create collection for monthly transaction
transactionRoutes.route("/upload").post(tokenVerification, upload.single('csvFile'), async (req, res) => {
    // If customer not found
    const naCustomer = {
        IsFree: false,
        CustName: "Name N/A",
        MobNo: "Mob N/A",
        Area: "Area N/A",
        Address: "",
        VC_NDS_MAC_ID: "N/A",
        LCOCode: "N/A",
        STBStatus: "N/A",
        STBState: "N/A",
        STBLocation: "N/A",
        AreaManager: "N/A",
        AreaPerson: "N/A",
        Remark: "N/A"
    };

    const { dbname, yearmonth: yearMonth } = req.headers;

    console.log(yearMonth)

    const CustomerModel = customerModel(dbname);
    const PlanModel = planModel(dbname);

    // Findding only selected fields
    const customersDataFromDB = await CustomerModel.find()
        .select("IsFree CustName MobNo Area Address AcNo VC_NDS_MAC_ID LCOCode STBStatus STBState STBLocation AreaManager AreaPerson Remark");

    const plansDataFromDB = await PlanModel.find();

    // // Drop collection if exist
    // const collection = mongoDBConnection.useDb(dbname, { useCache: true }).collection(collectionname.toLowerCase());
    // collection && collection.drop();


    // Mapping for calculate data in transactionsDataFromFile
    const transactionsDataFromFile = (
        // Getting json data from csv file
        await csvtojson.fieldDelimiter(',').getJsonFromCsv("./public/Transactions.csv")
    ).map((transactionDataFromFile) => {
        // Getting expiry date
        const ExpiryDate = transactionDataFromFile.Source === "HCAUTO"
            ? DateTime.fromJSDate(new Date(transactionDataFromFile.TransactionDateTime)).plus({ days: 30 }).toISODate()
            : DateTime.fromJSDate(new Date(transactionDataFromFile.ExpiryDate)).toISODate();

        // Setting Priority
        const Priority = transactionDataFromFile.PlanType === "Basic"
            ? 1
            : transactionDataFromFile.PlanType === "Hathway Bouquet"
                ? 2
                : transactionDataFromFile.PlanType === "Broadcaster Bouquet"
                    ? 3
                    : transactionDataFromFile.PlanType === "A-La-Carte"
                        ? 4
                        : 5;

        //Populated plan for Plan name
        let planIndex = plansDataFromDB.findIndex((plan) => plan.PlanName === transactionDataFromFile.PlanName);

        // Look plan in  plansDataFromDB if not found then look in transactionDataFromFile
        const plan = planIndex == -1
            ? {
                PlanName: transactionDataFromFile.PlanName,
                MRP: Number(transactionDataFromFile.CustomerBasePrice),
                LCOPrice: Number(transactionDataFromFile.LCOPrice),
                BCPrice: Number(transactionDataFromFile.BCPrice),
                SDCount: 0,
                HDCount: 0,
                CustomeMRP: 0
            }
            : plansDataFromDB[planIndex];

        // Setting customer custom price
        const CustomePrice = plan.CustomMRP > 0
            ? plan.CustomMRP
            : plan.MRP;

        // Getting plan period by spliting plan name
        const planPeriod = plan.PlanName.split(" ").pop();
        const planDays = planPeriod.slice(0, planPeriod.length - 1);

        // Getting base price
        const BasePrice = transactionDataFromFile.TransactionType === "Cancellation"
            ? -((CustomePrice / planDays) * Number(transactionDataFromFile.PayTerm))
            : CustomePrice;

        // Counting no  of channels . Here HD 1 channel=SD 2 channels
        const sdhdCount = plan.SDCount + plan.HDCount * 2;

        // Getting NCF (channel count)
        const NCF = transactionDataFromFile.PlanType === "Basic"
            ? 24
            : transactionDataFromFile.PlanType === "Hathway Bouquet"
                ? (sdhdCount - 1 % 100) % 25
                : sdhdCount;

        // Returning calculate data as object
        return {
            AcNo: transactionDataFromFile.CustomerID,
            TransactionDateTime: new Date(transactionDataFromFile.TransactionDateTime),
            PlanType: transactionDataFromFile.PlanType,
            TransactionType: transactionDataFromFile.TransactionType,
            PlanName: transactionDataFromFile.PlanName,
            LCOPrice: Number(transactionDataFromFile.LCOPrice),
            SDCount: plan.SDCount,
            HDCount: plan.HDCount,
            ExpiryDate, Priority, BasePrice, NCF
        }
    }).sort((a, b) => a.TransactionDateTime - b.TransactionDateTime);
    // ------------------------------------Stage 1 end-----------------------------------------------------


    // Getting unique transaction by A/c No and date. Sorted by priority
    const uniqueAcNoDate = transactionsDataFromFile
        .sort((a, b) => a.Priority - b.Priority)
        .filter((filterTransaction, index, array) =>
            array.findIndex(arrayTransaction =>
                // A/c No should be equal
                arrayTransaction.AcNo === filterTransaction.AcNo &&
                // // Priority should be 1 or 2
                // (arrayTransaction.Priority === 1 || arrayTransaction.Priority === 2) &&

                // TransactionDateTime should be equal
                DateTime.fromJSDate(arrayTransaction.TransactionDateTime).toISODate()
                == DateTime.fromJSDate(filterTransaction.TransactionDateTime).toISODate()
            ) === index
        );

    // Combining plans and calculating bills
    const packagesBill = await uniqueAcNoDate.map(uniqueAcNoDt => {
        // Getting transations form transactionsDataFromFile where uniqueAcNoDate A/c No and date matches
        const package = transactionsDataFromFile.filter((filterTransaction) => {
            // Checking if Priority 1 or 2 then return transactions within given range dates
            if (uniqueAcNoDate.Priority == 1 || uniqueAcNoDate.Priority == 2) {
                return (
                    // Should be equal AcNo
                    filterTransaction.AcNo === uniqueAcNoDt.AcNo &&

                    // uniqueAcNoDt should be equal or lesser than filterTransaction
                    DateTime.fromJSDate(filterTransaction.TransactionDateTime).toISODate()
                    >= DateTime.fromJSDate(uniqueAcNoDt.TransactionDateTime).toISODate() &&

                    // and filterTransaction should be lesser then uniqueAcNoDt+28days
                    DateTime.fromJSDate(filterTransaction.TransactionDateTime).toISODate()
                    < DateTime.fromJSDate(uniqueAcNoDt.TransactionDateTime).plus({ days: 28 }).toISODate()
                )
            }
            // else return transactions equal of given date
            else {
                return (
                    // Should be equal AcNo
                    filterTransaction.AcNo === uniqueAcNoDt.AcNo &&

                    // uniqueAcNoDt should be equal to filterTransaction
                    DateTime.fromJSDate(filterTransaction.TransactionDateTime).toISODate()
                    == DateTime.fromJSDate(uniqueAcNoDt.TransactionDateTime).toISODate()
                )
            }
        }
        ).sort((a, b) => DateTime.fromJSDate(a.TransactionDateTime) - DateTime.fromJSDate(b.TransactionDateTime));

        // Initialized billing variables
        let totalLCOPrice = 0;
        let totalBasePrice = 0;
        let totalNCF = 0;
        let Bill = 0;

        // Getting bills and const NCF channels
        package.map((transaction, index, array) => {
            totalLCOPrice += transaction.LCOPrice;
            totalBasePrice += transaction.BasePrice;

            array.filter(plan =>
                plan.PlanName === transaction.PlanName
            ).map((planName, index) => {
                if (planName.TransactionType !== "Cancellation") {
                    totalNCF += planName.NCF
                }
                else if (planName.TransactionType === "Cancellation") {
                    if (index != 0) { totalNCF -= planName.NCF }
                }
            });
        })

        totalNCF = (totalNCF / 25) | 0; //|0 for taking integer value for NCF count
        totalNCF = totalNCF * 23.6;

        Bill = totalBasePrice + totalNCF;

        //Populated transaction for Priority 1 or 2
        let transactionIndex = package.findIndex((transaction) =>
            transaction.AcNo == uniqueAcNoDt.AcNo &&
            (transaction.Priority == 1 ||
                transaction.Priority == 2)
        );

        // Getting collection name, if priority found then return package else uniqueAcNoDt
        const collectionName = transactionIndex == -1
            ? uniqueAcNoDt
            : package[transactionIndex];

        // Setting date and times
        const transactionDate = DateTime.fromJSDate(collectionName.TransactionDateTime).toISODate();
        const transactionTime = DateTime.fromJSDate(collectionName.TransactionDateTime).toISOTime();
        const expiryDate = collectionName.ExpiryDate;

        return {
            AcNo: uniqueAcNoDt.AcNo,
            transactionDate,
            transactionTime,
            expiryDate,
            package,
            totalBasePrice,
            totalLCOPrice,
            totalNCF, Bill
        }
    })
    // --------------------------------------Stage 2 end-------------------------------------------

    // Getting unique AcNo of transactions 
    const uniqueTransactions = await transactionsDataFromFile?.filter((transaction, index, array) => {
        return array.findIndex(object =>
            object.AcNo === transaction.AcNo
        ) === index
    })

    //Mapping uniqueTransactions for consolidating customers with transactions
    const customers = await uniqueTransactions.map(uniqueTransaction => {
        // Create custome object id (_id) field
        const id = new mongoose.Types.ObjectId(`ac${uniqueTransaction.AcNo}`).toString();

        //Populated customer for transactions A/c No
        const customerIndex = customersDataFromDB.findIndex((customer) => customer._id == id);

        // Look customer in customersDataFromDB if not found then set NA customer
        return customerIndex == -1
            ? { ...naCustomer, _id: id, AcNo: uniqueTransaction.AcNo }
            : customersDataFromDB[customerIndex];

        // // Getting package and bill
        // const packageBill = summerizePackageBill.filter(summerizedTransactions =>
        //     // A/c should be equal
        //     summerizedTransactions.AcNo === uniqueTransaction.AcNo
        // )
        //     // Mapped to remove AcNo field
        //     .map(transaction => {
        //         return {
        //             transactionDate: transaction.transactionDate,
        //             transactionTime: transaction.transactionTime,
        //             expiryDate: transaction.expiryDate,
        //             package: transaction.package,
        //             totalBasePrice: transaction.totalBasePrice,
        //             totalLCOPrice: transaction.totalLCOPrice,
        //             totalNCF: transaction.totalNCF,
        //             Bill: transaction.Bill
        //         }
        //     }
        //     );

        // return { ...customer._doc, packageBill };
    });
    // ------------------------------------Stage 3 end-------------------------------------------


    // Calculating statistics
    const totalRCSTBs = customers.length;

    const freeSTBs = (await customers.filter(customer => customer.IsFree)).length;

    const inActiveSTBs = customersDataFromDB.filter(customer =>
        customer.STBStatus?.toUpperCase() === "ACTIVE" &&
        customer.STBState?.toUpperCase() === "ALLOCATED" &&
        (
            customer.STBLocation?.toUpperCase() === "INLINE" ||
            customer.STBLocation?.toUpperCase() === "CAMEIN"
        )
    ).length - totalRCSTBs;

    const suspendedSTBs = customersDataFromDB.filter((customer) =>
        customer.STBStatus?.toUpperCase() === "SUSPEND" &&
        customer.STBState?.toUpperCase() === "ALLOCATED" &&
        (
            customer.STBLocation?.toUpperCase() === "INLINE" ||
            customer.STBLocation?.toUpperCase() === "CAMEIN"
        )
    ).length;

    const faultySTBs = customersDataFromDB.filter((customer) =>
        customer.STBState?.toUpperCase() === "FAULTY"
    ).length;

    const disconnectSTBs = customersDataFromDB.filter((customer) =>
        customer.STBStatus?.toUpperCase() === "DISCONNECT"
    ).length;

    const statistics = {
        totalRCSTBs, freeSTBs,
        inActiveSTBs, suspendedSTBs,
        disconnectSTBs, faultySTBs
    }
    // ----------------------------Stage 4 end-------------------------------------------------------

    // Saving stage 2,3 and 4 data to database and send response
    const PackagesBillsModel = trasactionsModel(dbname, "packages-bills");
    const PackageCustomersModel = trasactionsModel(dbname, "package-customers");
    const StatisticsModel = trasactionsModel(dbname, "statistics");

    const id = new mongoose.Types.ObjectId(`tran${yearMonth}`)

    PackagesBillsModel.findOneAndDelete({ _id: id })
        .catch(err => console.log(err));
    PackageCustomersModel.findOneAndDelete({ _id: id })
        .catch(err => console.log(err));
    StatisticsModel.findOneAndDelete({ _id: id })
        .catch(err => console.log(err));

    const packagesBillsRes = await PackagesBillsModel({ _id: id, yearMonth, data: packagesBill }).save()
        .then(() => {
            return ({
                code: 201,
                message: `${packagesBill?.length} Trasactions`
            });
        })
        .catch(err => {
            return ({
                code: 300,
                message: `Error while packages and bills upload: ${err}`
            });
        });

    const packageCustomersRes = await PackageCustomersModel({ _id: id, yearMonth, data: customers }).save()
        .then(() => {
            return ({
                code: 201,
                message: `${customers?.length} Customers`
            });
        })
        .catch(err => {
            return ({
                code: 300,
                message: `Error while package customers upload: ${err}`
            });
        });

    const statisticsRes = await StatisticsModel({ _id: id, yearMonth, data: statistics }).save()
        .then(() => {
            return ({
                code: 201,
                message: `Statistics data`
            });
        })
        .catch(err => {
            return ({
                code: 300,
                message: `Error while statistics upload: ${err}`
            });
        });

    res.send({ packagesBillsRes, packageCustomersRes, statisticsRes });
});

// API to send Bulk Customers.xlsx file to client
transactionRoutes.route("/download").post(tokenVerification, async (req, res) => {
    res.download("./public/sample/Bulk Transactions.xlsx")
});

// HTTP request post method to get recharged stbs A/c No. 
transactionRoutes.route("/rcstbacno").post(tokenVerification, async (req, res) => {
    const monthsList = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];

    let rcSTBsCount = [];

    const { dbName, ofYear } = req.body;

    for (let i = 0; i < monthsList.length; i++) {
        const collectionName = `${monthsList[i]}-${ofYear}`;
        const CustomerPackageModel = customerPackageModel(dbName, collectionName);

        const customers = (await CustomerPackageModel.find({}))[0]?.customers;

        rcSTBsCount.push(
            {
                totalRCSTBs: customers?.length || 0,
                freeSTBs: customers?.filter(customer => customer.IsFree == true)?.length || 0
            }
        );
    }

    // console.log(rcSTBsCount);
    res.send(rcSTBsCount);
})

// Export Router
module.exports = transactionRoutes;