# Keycloak dev server

This documentation is useful for local development of the user-web-client. In order to test the authentication, a Keycloak server is mandatory. This instruction will help to set this up.

## Requirements

- docker
- docker-compose

## 1. Start server

run `docker-compose up -d` to spawn a local instance of Keycloak

## 2. Disable requirement for https on admin interface

```bash
docker-compose exec keycloak bash

cd /opt/jboss/keycloak/bin

# Using the adin credentials defined in `docker-compose.yml`
./kcadm.sh config credentials --server http://localhost:8080/auth --realm master --user admin

./kcadm.sh update realms/master -s sslRequired=NONE
```

## 3. Create new auth client

- Open http://localhost:8080/auth
- Go to admin console and login using the credentials defined in `docker-compose.yml`
- Name: user-web-client
- Use root url http://localhost:4200
- Make sure the user-web-client is configured accordingly
- Start user-web-client and login using the admin credentials defined in `docker-compose.yml`
