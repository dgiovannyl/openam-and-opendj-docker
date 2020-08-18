# openam-and-opendj-docker

OpenAM and OpenDJ setup using docker and openam-configurator-tool jar.

# Requirements

- To run this project you must have docker installed and running.
- Add openam.test.com url to hosts file.

# Create and start containers

- docker-compose build
- docker-compose up

# Navigate to the openAM page.

- openam.test.com:8080/openam or localhost:8080/openam

# Login

- To login use the amAdmin user and the password defined in openam-and-opendj-docker\openam\configurator-tool\config.properties (ADMIN_PWD=11111111)
