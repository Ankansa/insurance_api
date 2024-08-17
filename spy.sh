#!/bin/bash

# Define the process name
PROCESS_NAME="app.js"

# Check if the process is running
if ps aux | grep -v grep | grep "$PROCESS_NAME" > /dev/null
then
    echo "$PROCESS_NAME is already running."
else
    echo "$PROCESS_NAME is not running. Starting it now..."
    echo "$PROCESS_NAME has been started."
    
    # Run the Node.js file
    node "$PROCESS_NAME"
    
    echo "$PROCESS_NAME is stopping."
fi

# Keep the terminal open
echo "Press any key to exit..."
read -n 1
