const cron = require("cron").CronJob;
let cpuController = require("../controllers/cpu-controller");

(function runCron() {

  let debug = process.env.CPU_USAGE_CHECK === "true";

  if (debug) {
    console.log("Running with CPU_USAGE_CHECK ...");

    // Cron job to run every 5 seconds
    const runEvery5Seconds = new cron(
      "*/5 * * * * *",
      async function () {
        cpuController.CPUutilizationRestart();
        // console.log("🚀 ~ runCron ~ runEvery5Seconds for sendReminderMsg:");
      },
      null,
      true,
      "Asia/Kolkata"
    );
  }
})();

// module.exports = runCron;
