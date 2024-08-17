## Run command

npm start

## Run command using .sh file

spy.sh

## Run command using .bat file

spy.bat

### CPU Monitoring and Auto-Restart System

I have implemented a system that continuously monitors CPU usage and automatically restarts the server if the CPU usage exceeds 70%.

#### How It Works:

1. Cron Job for CPU Monitoring:
   - A cron job runs every 5 seconds to check the CPU usage.
   - The CPU usage percentage is logged to the `cpu_usage_log.txt` during each check.
   - The CPU usage percentage is logged to the console during each check.
   - If the CPU usage exceeds 70%, the process is terminated using `process.exit(1)`.

2. Environment Variables:
   - In the `.env` file, if `CPU_USAGE_CHECK="true"`, the CPU usage monitoring is activated.
   - For testing purposes, I added a `CPU_USAGE_PERCENTAGE` key in the `.env` file. This allows you to manually set a custom CPU usage percentage to simulate different load conditions.

3. spy.bat or spy.sh File:
   - I created a `spy.bat or spy.sh` script that checks if the server process is running.
   - If the process is not running (e.g., it was stopped due to high CPU usage), the `spy.bat or spy.sh` script starts the process again.

4. Server-Side Cron Job:
   - I set up an additional cron job that runs every 6 seconds on the server.
   - This job triggers the `spy.bat or spy.sh` file, ensuring that the process is restarted if it has been stopped.

#### Result:

- Automatic Restart: If CPU usage exceeds 70%, the process is stopped and then automatically restarted by the `spy.bat or spy.sh` script, effectively rebooting the server.
- Custom Testing: You can test the restart mechanism by setting a custom CPU usage percentage using the `CPU_USAGE_PERCENTAGE` key in the `.env` file.
- Continuous Monitoring: The cron job logs CPU usage every 5 seconds, providing real-time visibility into the server's CPU load.

This setup ensures continuous monitoring and recovery, keeping the server running smoothly even under high CPU load conditions, and allows for easy testing of the restart functionality.


# End point with example

POST Task-1 – upload
Endpoint - http://localhost:3004/api/upload
Body - form-data
“filePath” - C:\Users\ankan\Downloads\data-sheet - Node js Assesment.csv
==========================================================================================================================================================================
POST Task-1 - get_policy_details
Endpoint - http://localhost:3004/api/get-policy-details
Body - raw (json)
{
    "name": "Lura Lucca"
}
==========================================================================================================================================================================
POST  Task-1 - get-aggregated-policy-by-user
Endpoint - http://localhost:3004/api/get-aggregated-policy-by-user
==========================================================================================================================================================================
POST Task-2 - post-message
Endpoint - http://localhost:3004/api/post-message
Body - raw (json)
{
    "message": "This is a sample message",
    "date": "2024-08-18",
    "time": "14:30:00"
}
