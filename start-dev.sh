#!/bin/bash

echo "Starting DB (docker-compose)..."
docker-compose up -d

echo "Starting React frontend..."
cd ./client
npm run dev &

echo "Starting Spring Boot backend..."
cd ../backend
./gradlew bootRun
