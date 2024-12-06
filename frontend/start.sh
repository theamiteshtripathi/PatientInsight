#!/bin/bash
# Kill any process using port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null

# Start the React app
npm start 
