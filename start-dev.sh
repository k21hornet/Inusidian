#!/bin/bash

echo "Starting DB (docker-compose)..."
cd db && docker-compose up -d

echo "Starting React frontend..."
cd ../client && npm run dev &

echo "Starting Spring Boot backend..."
cd ../inusidian && ./gradlew bootRun
