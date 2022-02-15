/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
//= ======================================================
//              Imports
//= ======================================================
const db = require('../controller/databaseConfig');
// var config = require('../config.js');
// var jwt = require('jsonwebtoken');
// const e = require('express');

//= ======================================================
//              Functions / Objects
//= ======================================================
const School = {
  findSchool(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'select * from category;';

      conn.query(sql, (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        // any results?
        if (result.length === 0) {
          // no results - callback with no err & results
          console.log('this is null');
          return callback(null, null);
        }
        // one result - returns result
        console.log(result);
        return callback(null, result);
      });
    });
  },

  findSchoolByID(catid, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'SELECT * FROM category WHERE categoryid = ?;';

      conn.query(sql, [catid], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        // any results?
        if (result.length === 0) {
          // no results - callback with no err & results
          console.log('this is null');
          return callback(null, null);
        }
        // one result - returns result
        console.log(result);
        return callback(null, result);
      });
    });
  },
};

//= ======================================================
//              Exports
//= ======================================================
module.exports = School;
