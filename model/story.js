/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

// =======================================================
//              Imports
// =======================================================
const db = require('../controller/databaseConfig');
// var config = require('../config.js');
// var jwt = require('jsonwebtoken');
// const e = require('express');

// =======================================================
//              Functions / Objects
// =======================================================

const story = {

  displayAllStory(callback) {
    // get a connection to the DB
    const conn = db.getConnection();
    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `select 
      story, storyId, title, description,
      DATE_FORMAT(story.created_at, '%Y-%m-%d') 'date' 
      FROM heroku_ace460f1419a5da.story`;

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

  selectStoryById(qnID, callback) {
    // get a connection to the DB
    const conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');
      const sql = `
      select story,storyId, title, description,DATE_FORMAT(story.created_at, '%Y-%m-%d') 'date' 
      FROM heroku_ace460f1419a5da.story where storyId = ?
      `;
      conn.query(sql, [qnID], (err, result) => {
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
        return callback(null, result);
      });
    });
  },

  displayTopStory(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'SELECT * FROM heroku_ace460f1419a5da.story  order by created_at desc limit 4;';
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

  selectStoryByUserID(userId, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'SELECT storyId, title, description FROM heroku_ace460f1419a5da.story WHERE userId = ?;';

      conn.query(sql, [userId], (err, result) => {
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

  insertStory(story, callback) {
    const storyTitle = story.title;
    const storyDescription = story.description;
    const storyUserId = story.userId;
    const stories = story.story;
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `
            INSERT INTO
                story 
                (title, description, userId, story)
            VALUES
                (?, ?, ?, ?);
                `;

      conn.query(sql, [storyTitle, storyDescription, storyUserId, stories], (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  deleteStory(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'DELETE FROM heroku_ace460f1419a5da.story WHERE storyId = ?;';

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

  updateStory(storyId, story, callback) {
    const storyTitle = story.title;
    const storyDescription = story.description;
    const userStory = story.story;
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `
                UPDATE
                    heroku_ace460f1419a5da.story
                SET
                title = ?,
                description = ?,
                story = ?
                WHERE
                storyId = ?;
                    `;

      conn.query(sql, [storyTitle, storyDescription, userStory, storyId], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  displayStoryComments(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT  comments.comment, u.username, comments.commentID,u.description,s.story, s.storyId
                FROM heroku_ace460f1419a5da.storycomments AS comments
                Inner join user as u on comments.userid = u.userid
                Inner join story as s on comments.storyID = s.storyId
                where s.storyId = ?
                group by comments.userid,comments.commentID;`;

      conn.query(sql, [id], (err, result) => {
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

  insertStoryComments(storyId, callback) {
    const storyUserID = storyId.userID;
    const storyStoryID = storyId.storyID;
    const storyComment = storyId.comment;

    // get a connection to the database
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `
                INSERT INTO 
                heroku_ace460f1419a5da.storycomments (
                    userID, 
                    storyID,
                      comment)
                VALUES
                    (?,?,?);
                `;

      conn.query(sql, [storyUserID, storyStoryID, storyComment], (err, result) => {
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
module.exports = story;
