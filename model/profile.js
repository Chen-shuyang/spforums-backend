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
const Profile = {
  findUserByUserID(username, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'SELECT username, email, school, credential, description, created_at FROM heroku_ace460f1419a5da.user WHERE userid = ?;';

      conn.query(sql, [username], (err, result) => {
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

  findUserPostedQn(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT q.*, u.username, u.credential ,r.status
      FROM heroku_ace460f1419a5da.questions AS q
      inner join user as u on u.userid = q.userid
      left join reports as r on r.postID = q.questionid
      WHERE q.userid = ?
      group by q.questionid;
                        `;

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

  findUserPostedQnSortByUpvotes(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT q.*, u.username, u.credential ,r.status, count(liked.questionid) AS upvotes
      FROM heroku_ace460f1419a5da.questions AS q
      LEFT JOIN qnlikes as liked on q.questionid = liked.questionid
      inner join user as u on u.userid = q.userid
      left join reports as r on r.postID = q.questionid
      WHERE q.userid = ?
      group by q.questionid
      ORDER BY upvotes DESC;
                        `;

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

  findUserPostedQnSortByRecent(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT q.*, u.username, u.credential ,r.status
      FROM heroku_ace460f1419a5da.questions AS q
      inner join user as u on u.userid = q.userid
      left join reports as r on r.postID = q.questionid
      WHERE q.userid = ?
      group by q.questionid
      ORDER BY created_at DESC;
                        `;

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

  findUserSavedQn(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT u.username, u.credential, q.*, s.saveId 
                           FROM heroku_ace460f1419a5da.questions AS q, heroku_ace460f1419a5da.user AS u, heroku_ace460f1419a5da.saved AS s 
                           WHERE s.questionid = q.questionid AND q.userid = u.userid AND s.userid = ?;
                        `;

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

  findUserLikeQn(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT u.username, u.credential, q.* 
                           FROM heroku_ace460f1419a5da.qnlikes AS l, heroku_ace460f1419a5da.user AS u, heroku_ace460f1419a5da.questions AS q 
                           WHERE q.userid = u.userid AND q.questionid = l.questionid AND l.userid = ?;
                        `;

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

  findUserLikeAns(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT u.username, u.credential, a.*, q.title, a.answerid 
                           FROM heroku_ace460f1419a5da.anslikes AS l, heroku_ace460f1419a5da.user AS u, heroku_ace460f1419a5da.answers AS a, heroku_ace460f1419a5da.questions AS q 
                           WHERE a.userid = u.userid AND a.answerid = l.ansid AND q.questionid = a.questionid AND l.userid = ?;
                        `;

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

  updateProfile(id, profile, callback) {
    const { username } = profile;
    const { email } = profile;
    const { school } = profile;
    const { credential } = profile;
    const { description } = profile;

    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err); // know what the error is
        return callback(err, null);
      }

      console.log('Connected!');

      const sql = `
                    UPDATE
                        heroku_ace460f1419a5da.user
                    SET
                        username = ?,
                        email = ?,
                        school = ?,
                        credential = ?,
                        description = ?
                    WHERE
                        userid = ?;
                    `;

      conn.query(sql, [username, email, school, credential, description, id], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  unsaveQuestions(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'DELETE FROM heroku_ace460f1419a5da.saved WHERE saveId = ?;';

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

  dislikeQns(data, callback) {
    const { userid } = data;
    const { questionid } = data;
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'DELETE FROM heroku_ace460f1419a5da.qnlikes WHERE userid = ? AND questionid = ?;';

      conn.query(sql, [userid, questionid], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  dislikeAns(data, callback) {
    const { userid } = data;
    const { answerid } = data;
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'DELETE FROM heroku_ace460f1419a5da.anslikes WHERE userid = ? AND ansid = ?;';

      conn.query(sql, [userid, answerid], (err, result) => {
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
module.exports = Profile;
