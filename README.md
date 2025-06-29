# INUSIDIAN

An app loosely based on the Spaced Repetition System (SRS), built with React.js and Spring Boot.
It helps users learn vocabulary efficiently using principles from the forgetting curve.

## Initial Setup

First, set up the database. Please start Docker.
(Make sure the Docker application is running beforehand.)

```
docker-compose up -d
```

Enter the container and execute the contents of "schema.sql" to create the tables.

```
docker-compose exec db bash         // 1. Enter the container
mysql -u root -ppass inusidian      // 2. Log in to the "inusidian" MySQL database
                                    // 3. Paste the contents of infra/schema.sql
docker-compose down                 // 4. Shut down Docker
cd ../client && npm i               // 5. npm install
```

Next, set up the shell scripts to launch the app. Return to the root directory and run the following:

```
chmod +x start-dev.sh stop-dev.sh
```

## Start

```
./start-dev.sh
```

## Close

```
./stop-dev.sh
```
