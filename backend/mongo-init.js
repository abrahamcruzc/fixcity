/**
 * @file mongo-init.js
 * @description MongoDB shell initialization script that selects a database and creates a user with read/write privileges.
 *
 * This script:
 *  - Switches the current shell context to the database specified by MONGO_INITDB_DATABASE.
 *  - Creates a user whose username and password are read from MONGO_USER and MONGO_PASSWORD environment variables.
 *  - Grants the created user the "readWrite" role on the same database.
 *
 * Environment variables:
 *  - MONGO_INITDB_DATABASE {string} - target database name to select and grant privileges on.
 *  - MONGO_USER {string} - username to create.
 *  - MONGO_PASSWORD {string} - password for the created user.
 *
 * Intended usage:
 *  - Run inside the mongo shell or as an init script (for example via the official MongoDB Docker image's /docker-entrypoint-initdb.d mechanism).
 *
 * Notes:
 *  - This script assumes it runs with sufficient privileges to create users.
 *  - Consider adding idempotency or existence checks if the script may run multiple times.
 */

db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);

db.createUser({
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGO_INITDB_DATABASE,
    },
  ],
});
