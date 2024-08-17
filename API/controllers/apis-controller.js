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

let apiController = {}


apiController.getPolicyDetails = async (req, res) => {
  try {
    // Parse and extract name from the request body
    const { name } = req.body;

    // Find the user by first name
    let pipeline = [{$match:{ "firstName": name }},
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

    console.log("Please wait we are collecting the information.....");
    const userData = await query_ctrl.aggregateQuery(User.UserModel, pipeline);
    // const user = await query_ctrl.findOne(User.UserModel, { firstName: name });

    // Check if the user exists
    if (!userData) {
      return res.status(404).json({
        status: false,
        data: null,
        message: "User not found",
      });
    }

    // Convert the user ID to a string
    // const user_id = user._id.toString();

    // Find the policy details by user ID
    // const policy_details = await query_ctrl.findByQuery(Policy.PolicyModel, { userId: user_id });

    // Respond with the policy details
    return res.status(200).json({
      status: true,
      data: userData,
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