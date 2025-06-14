#!/bin/bash

echo "Stopping React frontend (if running in background)..."
pkill -f "npm run dev"

echo "Stopping Spring Boot backend..."
pkill -f "GradleDaemon"

echo "Stopping DB (docker-compose)..."
cd db && docker-compose down
