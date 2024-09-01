#!/bin/bash

# Start the FastAPI backend
cd /app/backend

source /app/backend/splitwise_env/bin/activate

python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &

cd /app

# Start the Next.js frontend
npm start --prefix /app/frontend

# Wait for any process to exit
wait -n

# Exit with status of the process that exited first
exit $?
