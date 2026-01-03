const { Pool } = require("pg");

const pool = new Pool({
  user: "user1",
  host: "localhost",
  database: "ajax",
  password: "password123",
  port: 5432
});

module.exports = pool;
