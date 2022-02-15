/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
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
const Event = {
  displayAllEvents(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'SELECT * FROM heroku_ace460f1419a5da.events';

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

  displayEventByID(eventID, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT DISTINCT e.eventid, e.eventTitle, e.eventDescription, e.eventTime, e.eventDuration, 
                            e.maxCapacity, e.createdBy, count(p.eventid) 'currentCapacity', u.username
                            FROM heroku_ace460f1419a5da.events AS e
                            LEFT JOIN participants AS p on e.eventid = p.eventid
                            INNER JOIN user as u on e.createdBy = u.userid
                            WHERE e.eventid = ?`;

      conn.query(sql, [eventID], (err, result) => {
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

  insertEvent(event, callback) {
    const { eventTitle } = event;
    const { eventDescription } = event;
    const { eventTime } = event;
    const { eventDuration } = event;
    const createdBy = event.userid;
    const { maxCapacity } = event;

    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }

      console.log('Connected!');

      const sql = 'INSERT INTO heroku_ace460f1419a5da.events (eventTitle, eventDescription, eventTime, eventDuration, createdBy, maxCapacity) VALUES (?, ?, ?, ?, ?, ?);';

      conn.query(sql, [eventTitle, eventDescription, eventTime,
        eventDuration, createdBy, maxCapacity], (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  deleteEvent(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'DELETE FROM heroku_ace460f1419a5da.events WHERE eventid = ?;';

      conn.query(sql, [id], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        // any results?
        if (result.length === 0) {
          // no results - callback with no err & results
          return callback(null, null);
        }
        // one result - returns result
        return callback(null, result);
      });
    });
  },

  updateEvent(eventid, event, callback) {
    const { eventTitle } = event;
    const { eventDescription } = event;
    const { eventTime } = event;
    const { eventDuration } = event;
    const { maxCapacity } = event;

    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err); // know what the error is
        return callback(err, null);
      }

      console.log('Connected!');

      const sql = 'UPDATE heroku_ace460f1419a5da.events SET eventTitle = ?, eventDescription = ?, eventTime = ?, eventDuration = ?, maxCapacity = ? WHERE eventid = ?;';

      conn.query(sql, [eventid, eventTitle, eventDescription,
        eventTime, eventDuration, maxCapacity], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  joinEvent(event, callback) {
    const { eventid } = event;
    const { userid } = event;

    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }

      console.log('Connected!');

      const sql = `INSERT INTO heroku_ace460f1419a5da.participants (eventid, userid) 
                            SELECT ?, ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM heroku_ace460f1419a5da.participants
                            WHERE eventid = ? AND userid = ? LIMIT 1)`;

      conn.query(sql, [eventid, userid, eventid, userid], (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

};

//= ======================================================
//              Exports
//= ======================================================
module.exports = Event;
