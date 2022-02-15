/* eslint-disable linebreak-style */
/* eslint-disable no-console */
// ----------------------------------------------------
// Imports
// ----------------------------------------------------
const jwt = require('jsonwebtoken');
const db = require('../controller/databaseConfig');
// eslint-disable-next-line import/extensions
const config = require('../config.js');

// ----------------------------------------------------
// Objects / functions
// ----------------------------------------------------

const userLogSign = {
  verify(username, password, callback) {
    const conn = db.getConnection();
    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');
      const sql = `SELECT U.username, U.userid, R.roleName,U.secret
                FROM heroku_ace460f1419a5da.user AS U, heroku_ace460f1419a5da.role AS R 
                WHERE U.role = R.roleID AND username=? AND password=?`;

      // eslint-disable-next-line no-shadow

      conn.query(sql, [username, password], (err, result) => {
        conn.end();
        // console.log("Secretp"+secret + "=======token"+token);
        // const verified = speakeasy.totp.verify({
        //   secret,
        //   encoding: 'base32',
        //   token
        // });
        
        //if (verified) {
          if (err) {
            console.log(err);
            return callback(err, null);
          } if (result.length === 0) {
            return callback(null, null);
          }
          // there must only be 1 result here
          // since email is unique

          // confirm if we have the key
          console.log(`secret config key${config.key}`);
          console.log(result[0]);

          // generate the token
          const token = jwt.sign(
            {
              // (1)Payload
              userid: result[0].userid,
              role: result[0].roleName,
            },
            // (2) Secret Key
            config.key,
            // (3) Lifetime of a token
            {
              // expires in 24 hrs
              expiresIn: 86400,
            },
          );
          return callback(null, token, result[0]);
        //}
        // else{
        //   console.log(err);
        // }
      });
    });
  },

  oauthVerify(username, callback) {
    const conn = db.getConnection();
    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `SELECT U.username, U.userid, R.roleName 
                FROM heroku_ace460f1419a5da.user AS U, heroku_ace460f1419a5da.role AS R 
                WHERE U.role = R.roleID AND username=?`;

      // eslint-disable-next-line no-shadow
      conn.query(sql, [username], (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        } if (result.length === 0) {
          return callback(null, null);
        }
        // there must only be 1 result here
        // since email is unique

        // confirm if we have the key
        console.log(`secret config key${config.key}`);
        console.log(result[0]);

        // generate the token
        const token = jwt.sign(
          {
            // (1)Payload
            userid: result[0].userid,
            role: result[0].roleName,
          },
          // (2) Secret Key
          config.key,
          // (3) Lifetime of a token
          {
            // expires in 24 hrs
            expiresIn: 86400,
          },
        );
        return callback(null, token, result[0]);
      });
    });
  },

  oauthVerify(username, callback) {
    const conn = db.getConnection();
    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `SELECT U.username, U.userid, R.roleName 
                FROM heroku_ace460f1419a5da.user AS U, heroku_ace460f1419a5da.role AS R 
                WHERE U.role = R.roleID AND username=?`;

      // eslint-disable-next-line no-shadow
      conn.query(sql, [username], (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        } if (result.length === 0) {
          return callback(null, null);
        }
        // there must only be 1 result here
        // since email is unique

        // confirm if we have the key
        console.log(`secret config key${config.key}`);
        console.log(result[0]);

        // generate the token
        const token = jwt.sign(
          {
            // (1)Payload
            userid: result[0].userid,
            role: result[0].roleName,
          },
          // (2) Secret Key
          config.key,
          // (3) Lifetime of a token
          {
            // expires in 24 hrs
            expiresIn: 86400,
          },
        );
        return callback(null, token, result[0]);
      });
    });
  },

  register(user, callback) {
    const { email } = user;
    const { username } = user;
    const { password } = user;
    const { school } = user;
    const { secret } = user;

    // get a connection to the database
    const conn = db.getConnection();

    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `
                    INSERT INTO
                        heroku_ace460f1419a5da.user (
                          username, 
                          email, 
                          password,
                          school,
                          secret
                          )
                    VALUES
                    ( 
                      ?, ?, ?, ?,?
                    );
                    `;

      // eslint-disable-next-line no-shadow
      conn.query(sql, [username, email, password, school, secret], (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  registerGoogle(google, callback) {
    const { email } = google;
    const { username } = google;
    const googleid = google.googleID;
    const { school } = google;

    // get a connection to the database
    const conn = db.getConnection();

    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `
                    INSERT INTO
                        heroku_ace460f1419a5da.user (
                          googleid,
                          username, 
                          email, 
                          school)
                    VALUES
                    ( 
                      ?, ?, ?, ?
                    );
                    `;

      // eslint-disable-next-line no-shadow
      conn.query(sql, [googleid, username, email, school], (err, result) => {
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

// ----------------------------------------------------
// Exports
// ----------------------------------------------------
module.exports = userLogSign;
