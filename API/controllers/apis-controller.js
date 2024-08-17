const mongoose = require('mongoose');
const fs = require('fs');
const Agent = require('../../models/Agent');
const Account = require('../../models/Account');
const Carrier = require('../../models/Carrier');
const LOB = require('../../models/LOB');
const Policy = require('../../models/Policy');
const User = require('../../models/User');
const Message = require('../../models/Message')

const query_ctrl = require('./query-controller');
const multer = require('multer');
const path = require('path');
const csv = require('csv-parser');
const { response } = require('express');
const { userInfo } = require('os');
const { MessageModel } = require('../../models/Message');

// Set up multer for file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // The folder where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('filePath'); // Use 'filePath' if that is the field name

let apiController = {};

apiController.processFile = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({
        status: false,
        data: err,
        message: "Error uploading file",
      });
    }

    try {
      const filePath = req.file.path; // Get the uploaded file path
      const results = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            for (let row of results) {
              console.log(row);
              const agentName = row['agent'];
              console.log("Check point 1", agentName);

              await query_ctrl.createOne(Agent.AgentModel, { "name": agentName });

              const user_insert_data = {
                "firstName": row['firstname'],
                "dob": new Date(row['dob']),
                "address": row['address'],
                "phoneNumber": row['phone'],
                "state": row['state'],
                "zipCode": row['zip'],
                "email": row['email'],
                "gender": row['gender'],
                "userType": row['userType'],
              };
              console.log("** User collection started saving **");
              let user_insert_responce = await query_ctrl.createOne(User.UserModel, user_insert_data);
              console.log("** User collection finished saving *********************** **", user_insert_responce._id);

              const account_insert_data = { "accountName": row['account_name'] };
              console.log("** Account collection started saving **");
              await query_ctrl.createOne(Account.AccountModel, account_insert_data);
              console.log("** Account collection finished saving **");

              const lob = { "categoryName": row['category_name'] };
              console.log("** LOB collection started saving **");
              let lob_insert_responce = await query_ctrl.createOne(LOB.LOBModel, lob);
              console.log("** LOB collection finished saving **");

              const carrier_insert_data = { "companyName": row['company_name'] };
              console.log("** Carrier collection started saving **");
              let carrier_insert_responce = await query_ctrl.createOne(Carrier.CarrierModel, carrier_insert_data);
              console.log("** Carrier collection finished saving **@@@@@@@@@@@@@@@@", carrier_insert_responce._id);

              const policy = {
                "policyNumber": row['policy_number'],
                "policyStartDate": new Date(row['policy_start_date']),
                "policyEndDate": new Date(row['policy_end_date']),
                "categotyCollectionId": lob_insert_responce._id,
                "companyId": carrier_insert_responce._id,
                "userId": user_insert_responce._id,
              };
              console.log("** Policy collection started saving **");
              await query_ctrl.createOne(Policy.PolicyModel, policy);
              console.log("** Policy collection finished saving **");
            }

            console.log("** All operations completed successfully **");

            // Delete the uploaded file after processing
            fs.unlinkSync(filePath);

            return res.status(200).json({
              status: true,
              message: "File processed successfully",
            });

          } catch (processingError) {
            console.log("Error during processing:", processingError);
            // Ensure the file is deleted even if an error occurs
            fs.unlinkSync(filePath);
            return res.status(500).json({
              status: false,
              data: processingError,
              message: "Error processing file",
            });
          }
        });

    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        status: false,
        data: error,
        message: "Error processing file",
      });
    }
  });
};


apiController.getPolicyDetails = async (req, res) => {
  try {
    // Parse and extract name from the request body
    const { name } = req.body;

    // Find the user by first name
    const user = await query_ctrl.findOne(User.UserModel, { firstName: name });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        status: false,
        data: null,
        message: "User not found",
      });
    }

    // Convert the user ID to a string
    const user_id = user._id.toString();

    // Find the policy details by user ID
    console.log("Please wait we are collecting the information.....");
    const policy_details = await query_ctrl.findByQuery(Policy.PolicyModel, { userId: user_id });

    // Respond with the policy details
    return res.status(200).json({
      status: true,
      data: policy_details,
      message: "Successfully retrieved policy details",
    });

  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      status: false,
      data: null,
      message: "Error retrieving policy details",
    });
  }
};



apiController.getAggregatedPolicyByUser = async (req, res) => {
  try {
    console.log("Please wait we are collecting the information.....");

    // Aggregation pipeline to get the required data
    let pipeline = [
      {
        $lookup: {
          from: 'Policy', // Collection name of policies
          localField: '_id',
          foreignField: 'userId',
          as: 'policies',
        },
      },
      {
        $unwind: {
          path: '$policies',
          preserveNullAndEmptyArrays: true, // To include users with no policies
        },
      },
      {
        $lookup: {
          from: 'Carrier', // Collection name of companies
          localField: 'policies.companyId',
          foreignField: '_id',
          as: 'companyDetails',
        },
      },
      {
        $lookup: {
          from: 'LOB', // Collection name of categories
          localField: 'policies.categotyCollectionId',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $group: {
          _id: '$_id',
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          totalPolicies: { $sum: 1 },
          policies: {
            $push: {
              policy_number: '$policies.policyNumber',
              policy_start_date: '$policies.policyStartDate',
              policy_end_date: '$policies.policyEndDate',
              company_details: { $arrayElemAt: ['$companyDetails', 0] }, // Since lookup returns an array
              category_details: { $arrayElemAt: ['$categoryDetails', 0] }, // Since lookup returns an array
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          user_id: '$_id',
          first_name: '$firstName',
          last_name: '$lastName',
          total_policies: '$totalPolicies',
          policies: '$policies',
        },
      },
    ];

    const aggregatedData = await query_ctrl.aggregateQuery(User.UserModel, pipeline);
    // Respond with the aggregated data
    return res.status(200).json({
      status: true,
      data: aggregatedData,
      message: "Successfully retrieved aggregated policy data by each user",
    });

  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      status: false,
      data: null,
      message: "Error retrieving aggregated policy data",
    });
  }
};


apiController.postMessage = async (req, res) => {
  try {
    const { message, date, time } = req.body;
    const date_time = new Date(`${date}T${time}Z`);

    const message_insert_data = { "message": message, "datetime": date_time }

    let insert_responce = await query_ctrl.createOne(Message.MessageModel, message_insert_data);

    return res.status(200).json({
      status: true,
      data: insert_responce,
      message: "Message saved sucessfully",
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      status: false,
      data: null,
      message: "Error saving postMessage",
    });
  }
};

module.exports = apiController;