# Ki Foundation tech test

- [Ki Foundation tech test](#ki-foundation-tech-test)
  - [Run](#run)
    - [Migrations](#migrations)
  - [Setup](#setup)
    - [Dependencies](#dependencies)
    - [Docker](#docker)
    - [Barebone Setup](#barebone-setup)
      - [Database](#database)
      - [Create Database Schema](#create-database-schema)
    - [Init DB](#init-db)
  - [Database schema](#database-schema)
  - [TODO](#todo)

## Run

```
$ yarn dev
```

### Migrations

```
$ yarn typeorm migration:generate src/migrations/NameOfYourMig
$ yarn typeorm migration:create src/migrations/NameOfYourMig
$ yarn typeorm migration:run
$ yarn typeorm migration:revert
```

## Setup

### Dependencies

```
$ yarn install
```

### Docker

Setup a development environment with Docker. Copy [.env.example](./.env.example) and rename to `.env` - `cp .env.example .env` - which sets the required environments for PostgreSQL such as `DATABASE_URL`.

Start the PostgreSQL database

```bash
docker-compose -f docker-compose-dev.yml up --build
```

### Barebone Setup

#### Database

```
$ psql -d postgres
```

```
CREATE ROLE kifoundation WITH LOGIN PASSWORD 'kifoundation';
ALTER ROLE kifoundation SUPERUSER CREATEDB;
CREATE DATABASE kifoundation_tech_test OWNER kifoundation;
GRANT ALL PRIVILEGES ON DATABASE kifoundation_tech_test TO kifoundation;
```

To make sure everything is properly set, run `\l` in `psql`. It should return something like that:

```
 Name                      | Owner            | Encoding | Collate | Ctype | Access privileges
---------------------------+------------------+----------+---------+-------+-------------------
 kifoundation              | kifoundation     | UTF8     | C       | C     | =Tc/kifoundation +
```

#### Create Database Schema

Before going any further the API expects your Postgres database to have a schema named whatever you want. Use your favorite client to connect to your postgres instance and run.
This is not needed on docker, the init script does it.

```sql
CREATE SCHEMA IF NOT EXISTS foundation;
```

### Init DB

This will drop the database and seed it, do not use in production.

```
yarn dev:db:init
```

or

```
docker-compose -f docker-compose-dev.yml exec yarn dev:db:init
```

## Database schema

![Database schema](docs/schema.png)

## TODO

- Add a SessionController and allow the creation of jwt token using https://github.com/auth0/node-jsonwebtoken in exchange for a pwd
