var express = require('express');
var router = express.Router();
console.log("+++++++++++++++++++++++++++++++++++++++")
const upload_ctrl = require('../controllers/apis-controller');

let cronJob = require('../routes/cron')

router.post('/upload', (req, res, next) => {
    console.log('======= API request for ========= upload');
    upload_ctrl.processFile(req, res, next);
});

router.post('/get-policy-details', (req, res, next) => {
    console.log('======= API request for ========= /get-policy-details');
    upload_ctrl.getPolicyDetails(req, res, next);
});

router.post('/get-aggregated-policy-by-user', (req, res, next) => {
    console.log('======= API request for ========= /get-aggregated-policy-by-user');
    upload_ctrl.getAggregatedPolicyByUser(req, res, next);
});

router.post('/post-message', (req, res, next) => {
    console.log('======= API request for ========= /post-message');
    upload_ctrl.postMessage(req, res, next);
});

module.exports = router;
