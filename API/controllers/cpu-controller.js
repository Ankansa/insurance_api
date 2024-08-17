const os = require('os');

let cpuController = {};

cpuController.CPUutilizationRestart = async (req, res) => {
    try {
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
            const cpu_use_percentage = ((total - idle) / total) * 100
            let usage 
            if (process.env.CPU_USAGE){
                usage = process.env.CPU_USAGE
            }
            else{
                usage = cpu_use_percentage
            }
            // const usage = 80 //percentage
            console.log(`CPU Usage: ${usage}%`);

            if (usage > 70) {
                console.log('CPU usage exceeds 70%. Restarting the server...');

                // Exit the process; PM2 will automatically restart it
                process.exit(1);
                

                // Return to avoid further execution
                // return;
            } else {
                console.log("CPU usage is within acceptable limits.");
                if (res) {
                    return res.status(200).json({
                        status: true,
                        data: null,
                        message: "CPU usage is within acceptable limits.",
                    });
                }
            }
        };

        // Call the calculateCPUUsage function to check the CPU usage
        calculateCPUUsage();

    } catch (error) {
        console.log("Error:", error);
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
