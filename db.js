//CREATE AND EXPORT A CONNECTION POOL FOR THE DB

const mysql = require('mysql2/promise'); //import the mysql2 library with promise support for async/await functionality

const pool = mysql.createPool ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_tech',
    waitForConnections: true,
    connectionLimit: 10, //max number of concurrent connections allowed in the pool
    queueLimit: 0, //no limit on the number of requests that can wait in the queue
});

module.exports = pool; //export the connection pool for use in other part of the application