#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Change to backend directory and run the application
cd backend
./gradlew bootRun
