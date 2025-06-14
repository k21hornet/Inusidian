# INUSIDIAN
Spring Boot + React

## Initial Setup
First, set up the database. Navigate to the "db" directory and start Docker.
(Make sure the Docker application is running beforehand.)
~~~
cd db && docker-compose up -d
~~~
Enter the container and execute the contents of "schema.sql" to create the tables.
~~~
docker-compose exec db /bin/bash    // 1. Enter the container  
mysql -u root -p inusidian          // 2. Log in to the "inusidian" MySQL database  
                                    // 3. Enter the password (password is "pass")
                                    // 4. Paste the contents of schema.sql
docker-compose down                 // 5. Shut down Docker  
~~~
Next, set up the shell scripts to launch the app. Return to the root directory and run the following:
~~~
chmod +x start-dev.sh stop-dev.sh
~~~

## Start
~~~
./start-dev.sh
~~~

## Close
~~~
./stop-dev.sh
~~~