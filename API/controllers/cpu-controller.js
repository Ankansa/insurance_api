const os = require('os');
const fs = require('fs');
const path = require('path');

let cpuController = {};

cpuController.CPUutilizationRestart = async (req, res) => {
    try {
        // Function to get the current timestamp
        const getTimestamp = () => {
            const now = new Date();
            return now.toISOString();
        };

        // Function to calculate CPU usage percentage
        const calculateCPUUsage = () => {
            const cpus = os.cpus();
            let totalIdle = 0;
            let totalTick = 0;

            cpus.forEach((cpu) => {
                for (let type in cpu.times) {
                    totalTick += cpu.times[type];
                }
                totalIdle += cpu.times.idle;
            });

            const idle = totalIdle / cpus.length;
            const total = totalTick / cpus.length;
            const cpu_use_percentage = ((total - idle) / total) * 100;
            let usage;
            if (process.env.CPU_USAGE_PERCENTAGE) {
                usage = process.env.CPU_USAGE_PERCENTAGE;
            } else {
                usage = cpu_use_percentage;
            }
            // const usage = 80 //percentage
            const timestamp = getTimestamp();
            const logMessage = `${timestamp} - CPU Usage: ${usage}%`;

            console.log(logMessage);

            // Log the CPU usage to a file
            fs.appendFileSync(path.join(process.cwd(), 'cpu_usage_log.txt'), logMessage + '\n');


            if (usage > 70) {
                const restartMessage = `${timestamp} - CPU usage exceeds 70%. Restarting the server...`;
                console.log(restartMessage);

                // Log the restart message to a file
                fs.appendFileSync(path.join(process.cwd(), 'cpu_usage_log.txt'), restartMessage + '\n');


                // Exit the process; PM2 will automatically restart it
                process.exit(1);

                // Return to avoid further execution
                // return;
            } else {
                const okMessage = `${timestamp} - CPU usage is within acceptable limits.`;
                console.log(okMessage);

                // Log the OK message to a file
                fs.appendFileSync(path.join(process.cwd(), 'cpu_usage_log.txt'), okMessage + '\n');


                if (res) {
                    return res.status(200).json({
                        status: true,
                        data: null,
                        message: okMessage,
                    });
                }
            }
        };

        // Call the calculateCPUUsage function to check the CPU usage
        calculateCPUUsage();

    } catch (error) {
        const timestamp = getTimestamp();
        const errorMessage = `${timestamp} - Error: ${error}`;
        console.log(errorMessage);

        // Log the error to the file
        fs.appendFileSync(path.join(process.cwd(), 'cpu_usage_log.txt'), errorMessage + '\n');


        if (res) {
            return res.status(500).json({
                status: false,
                data: null,
                message: "Error getting the CPU usage details",
            });
        }
    }
};

module.exports = cpuController;
