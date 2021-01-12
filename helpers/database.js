const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'user',
  database: 'node_course',
  password: '1234'
});

module.exports = pool.promise();