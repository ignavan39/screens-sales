# Screens Sales 📱

## Description

CMS for selling screens

### Database diagram

<code><img width="auto" height="500" src="./.assets/Screens_sale.png"></img></code>

## Installation

```bash
$ yarn
```

## Running the app

```bash
#running database
$ docker-compose up -d
```

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Local Tunnel : 
```bash
$ lt --subdomain big-swan-85 --port 3000
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Migrations :

### For start database migration :
```bash
$ typeorm migration:run
```

### For revert migration :
```bash
$ typeorm migration:revert 
```

### For generate migration file :
```bash
$ npx typeorm migration:create -n ${nameMigration} -d src/migrations
```

## Swagger Api

```
http://localhost:3000/api/
```
![link](http://localhost:3000/api/)

Nest is [MIT licensed](LICENSE).
