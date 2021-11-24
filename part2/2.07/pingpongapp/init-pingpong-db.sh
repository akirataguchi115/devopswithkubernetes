#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "dbuser" --dbname "pingpongdb" <<-EOSQL
    CREATE USER dbuser;
    CREATE DATABASE pingpongdb;
    GRANT ALL PRIVILEGES ON DATABASE pingpongdb TO dbuser
    CREATE TABLE pingpong;
EOSQL