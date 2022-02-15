/* eslint-disable linebreak-style */
/* eslint-disable no-console */
// sanity check
console.log('--------------------------------------');
console.log('databaseconfig.js');
console.log('--------------------------------------');

//= ======================================================
//              Imports
//= ======================================================
const mysql = require('mysql');

//= ======================================================
//              Objects / Functions
//= ======================================================
const dbconnect = {
  getConnection() {
    const conn = mysql.createConnection({
      host: 'us-cdbr-east-04.cleardb.com',
      user: 'b3e10d98a728fc',

      password: '70543b7f',

      database: 'heroku_ace460f1419a5da',
    });
    return conn;
  },
};

//= ======================================================
//              Exports
//= ======================================================
module.exports = dbconnect;
