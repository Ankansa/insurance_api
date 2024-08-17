const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const csv = require('csv-parser');
const query_ctrl = require('../controllers/query-controller');
const Agent = require('../../models/Agent');
const User = require('../../models/User');
const Account = require('../../models/Account');
const LOB = require('../../models/LOB');
const Carrier = require('../../models/Carrier');
const Policy = require('../../models/Policy');

const processCSV = async (filePath) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          for (let row of results) {
            try {
              const agentName = row['agent'];
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
              let user_insert_responce = await query_ctrl.createOne(User.UserModel, user_insert_data);

              const account_insert_data = { "accountName": row['account_name'] };
              await query_ctrl.createOne(Account.AccountModel, account_insert_data);

              const lob = { "categoryName": row['category_name'] };
              let lob_insert_responce = await query_ctrl.createOne(LOB.LOBModel, lob);

              const carrier_insert_data = { "companyName": row['company_name'] };
              let carrier_insert_responce = await query_ctrl.createOne(Carrier.CarrierModel, carrier_insert_data);

              const policy = {
                "policyNumber": row['policy_number'],
                "policyStartDate": new Date(row['policy_start_date']),
                "policyEndDate": new Date(row['policy_end_date']),
                "categotyCollectionId": lob_insert_responce._id,
                "companyId": carrier_insert_responce._id,
                "userId": user_insert_responce._id,
              };
              await query_ctrl.createOne(Policy.PolicyModel, policy);
            } catch (innerError) {
              console.error("Error processing row:", row, innerError);
              reject({ status: 'error', error: innerError });
            }
          }

          resolve({ status: 'success' });

        } catch (error) {
          console.error("Error processing CSV file:", error);
          reject({ status: 'error', error: error });
        }
      })
      .on('error', (streamError) => {
        console.error("Error reading CSV file:", streamError);
        reject({ status: 'error', error: streamError });
      });
  });
};

processCSV(workerData.filePath)
  .then(result => parentPort.postMessage(result))
  .catch(error => {
    console.error("Error in worker thread:", error);
    parentPort.postMessage({ status: 'error', error: error });
  });
