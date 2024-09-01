#!/bin/bash

# Start the FastAPI backend
/app/splitwise_env/bin/uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 &

# Start the Next.js frontend
npm start --prefix /app/frontend

# Wait for any process to exit
wait -n

# Exit with status of the process that exited first
exit $?
