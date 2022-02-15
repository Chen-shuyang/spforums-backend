/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

//= ======================================================
//              Imports
//= ======================================================
const db = require('../controller/databaseConfig');

//= ======================================================
//              Functions / Objects
//= ======================================================
const Admin = {

  //    Dashboard
  // --------------
  numberOfUsers(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');
      const sql = 'SELECT COUNT(userid) \'userNo\' FROM heroku_ace460f1419a5da.user';
      // eslint-disable-next-line no-shadow
      conn.query(sql, [], (err, result) => {
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

  numberOfPosts(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'SELECT COUNT(questionid) \'postNo\' FROM heroku_ace460f1419a5da.questions';

      conn.query(sql, [], (err, result) => {
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

  numberOfStories(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'SELECT COUNT(storyId) \'storyNo\' FROM heroku_ace460f1419a5da.story';

      conn.query(sql, [], (err, result) => {
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

  numberOfEvents(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'SELECT COUNT(eventid) \'eventNo\' FROM heroku_ace460f1419a5da.events';

      conn.query(sql, [], (err, result) => {
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

  topTenQuestions(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT distinct question.questionid, question.title, question.description, count(liked.questionid) 'upvotes'  
                FROM heroku_ace460f1419a5da.questions AS question
                LEFT JOIN qnlikes as liked on question.questionid = liked.questionid
                
                group by question.questionid
                order by upvotes DESC LIMIT 10;`;

      conn.query(sql, [], (err, result) => {
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
        console.log(result);
        return callback(null, result);
      });
    });
  },

  topTenStories(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT distinct S.storyId, S.title, S.story, s.storyLike, count(C.storyID) 'comments'  
                FROM heroku_ace460f1419a5da.story AS S
                LEFT JOIN storyComments as C on S.storyId= C.storyID

                                
                group by S.storyId
                order by s.storyLike DESC LIMIT 10;`;

      conn.query(sql, [], (err, result) => {
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

  //    post-admin
  // -----------------
  listQnByUpvotes(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT distinct question.questionid, question.title, question.description, u.username, 
                u.credential, count(liked.questionid) 'upvotes', DATE_FORMAT(question.created_at, '%Y-%m-%d') 'date'  
                FROM heroku_ace460f1419a5da.questions AS question
                LEFT JOIN qnlikes as liked on question.questionid = liked.questionid
                Inner join user as u on question.userid = u.userid
                
                group by question.userid,question.questionid
                order by upvotes DESC;`;

      conn.query(sql, [], (err, result) => {
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

  getPostByUserSearch(username, callback) {
    // get a connection to the database
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `SELECT questions.questionid, username, questions.title, questions.description, DATE_FORMAT(questions.created_at, '%Y-%m-%d') 'date', COUNT(liked.questionid) 'upvotes'
                FROM heroku_ace460f1419a5da.questions 
                LEFT JOIN qnlikes AS liked ON questions.questionid = liked.questionid
                INNER JOIN heroku_ace460f1419a5da.user ON questions.userid = user.userid
                WHERE username LIKE ?
                GROUP BY questions.questionid`;

      const queryParams = [`%${username}%`];

      conn.query(sql, queryParams, (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  getPostByDate(start, end, callback) {
    // get a connection to the database
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      if (start === '' || end === '' || (start === '' && end === '')) {
        const sql = `SELECT questions.questionid, username, questions.title, questions.description, DATE_FORMAT(questions.created_at, '%Y-%m-%d') 'date', COUNT(liked.questionid) 'upvotes'
                    FROM heroku_ace460f1419a5da.questions 
                    LEFT JOIN qnlikes AS liked ON questions.questionid = liked.questionid
                    INNER JOIN heroku_ace460f1419a5da.user ON questions.userid = user.userid
                    GROUP BY questions.questionid`;

        conn.query(sql, [], (err, result) => {
          conn.end();

          if (err) {
            console.log(err);
            return callback(err, null);
          }
          return callback(null, result);
        });
      } else if (start === end) {
        const sql = `SELECT questions.questionid, username, questions.title, questions.description, DATE_FORMAT(questions.created_at, '%Y-%m-%d') 'date', COUNT(liked.questionid) 'upvotes'
                    FROM heroku_ace460f1419a5da.questions 
                    LEFT JOIN qnlikes AS liked ON questions.questionid = liked.questionid
                    INNER JOIN heroku_ace460f1419a5da.user ON questions.userid = user.userid
                    WHERE DATE_FORMAT(questions.created_at, '%Y-%m-%d') = ?
                    GROUP BY questions.questionid`;

        conn.query(sql, [start], (err, result) => {
          conn.end();

          if (err) {
            console.log(err);
            return callback(err, null);
          }
          return callback(null, result);
        });
      } else {
        const sql = `SELECT questions.questionid, username, questions.title, questions.description, DATE_FORMAT(questions.created_at, '%Y-%m-%d') 'date', COUNT(liked.questionid) 'upvotes'
                    FROM heroku_ace460f1419a5da.questions 
                    LEFT JOIN qnlikes AS liked ON questions.questionid = liked.questionid
                    INNER JOIN heroku_ace460f1419a5da.user ON questions.userid = user.userid
                    WHERE DATE_FORMAT(questions.created_at, '%Y-%m-%d') >= ? AND DATE_FORMAT(questions.created_at, '%Y-%m-%d') <= ?
                    GROUP BY questions.questionid`;

        conn.query(sql, [start, end], (err, result) => {
          conn.end();

          if (err) {
            console.log(err);
            return callback(err, null);
          }
          return callback(null, result);
        });
      }
    });
  },

  //    story-admin
  // -----------------
  listStoriesByUpvotes(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT distinct S.storyId, S.description, S.title, S.story, U.username, DATE_FORMAT(S.created_at, '%Y-%m-%d') 'date'  
                FROM heroku_ace460f1419a5da.story AS S
                LEFT JOIN heroku_ace460f1419a5da.user as U on S.userid = U.userid
                                
                group by S.storyId
                order by s.storyLike DESC;`;

      conn.query(sql, [], (err, result) => {
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
        console.log(result);
        return callback(null, result);
      });
    });
  },

  getStoriesByUserSearch(username, callback) {
    // get a connection to the database
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `SELECT distinct S.storyId, S.description, S.title, S.story, U.username, DATE_FORMAT(S.created_at, '%Y-%m-%d') 'date'  
                FROM heroku_ace460f1419a5da.story AS S
                LEFT JOIN heroku_ace460f1419a5da.user as U on S.userid = U.userid
                WHERE U.username LIKE ?
                group by S.storyId`;

      const queryParams = [`%${username}%`];

      conn.query(sql, queryParams, (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  getStoriesByDate(start, end, callback) {
    // get a connection to the database
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      if (start === '' || end === '' || (start === '' && end === '')) {
        const sql = `SELECT distinct S.storyId, S.description, S.title, S.story, U.username, DATE_FORMAT(S.created_at, '%Y-%m-%d') 'date'  
                    FROM heroku_ace460f1419a5da.story AS S
                    LEFT JOIN heroku_ace460f1419a5da.user as U on S.userid = U.userid
                    group by S.storyId`;

        conn.query(sql, [], (err, result) => {
          conn.end();

          if (err) {
            console.log(err);
            return callback(err, null);
          }
          return callback(null, result);
        });
      } else if (start === end) {
        const sql = `                 
                    SELECT distinct S.storyId, S.description, S.title, S.story, U.username, DATE_FORMAT(S.created_at, '%Y-%m-%d') 'date'  
                    FROM heroku_ace460f1419a5da.story AS S
                    LEFT JOIN heroku_ace460f1419a5da.user as U on S.userid = U.userid
                    WHERE DATE_FORMAT(S.created_at, '%Y-%m-%d') = ?
                    group by S.storyId`;

        conn.query(sql, [start], (err, result) => {
          conn.end();

          if (err) {
            console.log(err);
            return callback(err, null);
          }
          return callback(null, result);
        });
      } else {
        const sql = `                    
                    SELECT distinct S.storyId, S.description, S.title, S.story, U.username, DATE_FORMAT(S.created_at, '%Y-%m-%d') 'date'  
                    FROM heroku_ace460f1419a5da.story AS S
                    LEFT JOIN heroku_ace460f1419a5da.user as U on S.userid = U.userid
                    WHERE DATE_FORMAT(S.created_at, '%Y-%m-%d') >= ? AND DATE_FORMAT(S.created_at, '%Y-%m-%d') <= ?
                    group by S.storyId`;

        conn.query(sql, [start, end], (err, result) => {
          conn.end();

          if (err) {
            console.log(err);
            return callback(err, null);
          }
          return callback(null, result);
        });
      }
    });
  },

  deleteMyStory(id, callback) {
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

  //    team
  // -----------------
  getAllUsersInfo(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT U.userid, U.username, U.email, U.school, R.roleID, R.roleName FROM heroku_ace460f1419a5da.user AS U, heroku_ace460f1419a5da.role AS R
                            WHERE U.role = R.roleID;`;

      conn.query(sql, [], (err, result) => {
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

  getAllUserByRole(role, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT U.userid, U.username, U.email, U.school, R.roleID, R.roleName FROM heroku_ace460f1419a5da.user AS U, heroku_ace460f1419a5da.role AS R
                            WHERE U.role = R.roleID AND R.roleName = ?;`;

      conn.query(sql, [role], (err, result) => {
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

  getUserByUserSearch(username, callback) {
    // get a connection to the database
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `SELECT U.userid, U.username, U.email, U.school, R.roleID, R.roleName FROM heroku_ace460f1419a5da.user AS U, heroku_ace460f1419a5da.role AS R
                            WHERE U.role = R.roleID AND username LIKE ?;`;

      const queryParams = [`%${username}%`];

      conn.query(sql, queryParams, (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  getUserRoles(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT R.*, COUNT(userid) AS no_of_users 
                            FROM heroku_ace460f1419a5da.role AS R
                            LEFT JOIN heroku_ace460f1419a5da.user AS U
                            ON U.role = R.roleID
                            GROUP BY R.roleID;`;

      conn.query(sql, [], (err, result) => {
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

  addUserRoles(group, callback) {
    const conn = db.getConnection();

    const { roleName } = group;
    const { roleDes } = group;

    console.log(`roleName: ${typeof (roleName)}`);
    console.log(`roleDes: ${typeof (roleDes)}`);

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `
                INSERT INTO
                    heroku_ace460f1419a5da.role 
                    (roleName, roleDescription)
                VALUES
                    (?, ?);
                    `;

      conn.query(sql, [roleName, roleDes], (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  updateUserRole(role, callback) {
    const userId = role.userID;
    const roleID = role.role;

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
                    role = ?
                WHERE
                    userid = ?;
                    `;

      conn.query(sql, [roleID, userId], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  updateRoles(roleId, role, callback) {
    const roleName = role.role;
    const { roleDes } = role;

    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err); // know what the error is
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `
                UPDATE
                    heroku_ace460f1419a5da.role
                SET
                    roleName = ?,
                    roleDescription = ?
                WHERE
                    roleID = ?;
                    `;

      conn.query(sql, [roleName, roleDes, roleId], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  deleteRole(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'DELETE FROM heroku_ace460f1419a5da.role WHERE roleId = ?;';

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

  deleteUser(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'DELETE FROM heroku_ace460f1419a5da.user WHERE userid = ?;';

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

  //    Reports
  // -----------------
  listReports(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT R.reportID, R.title, R.description 'reportDetail', R.status, U.username, U.email, Q.questionid, Q.title 'qnTitle', Q.description, T.username 'Poster', T.email 'PosterEmail'
                FROM heroku_ace460f1419a5da.reports AS R, heroku_ace460f1419a5da.questions AS Q, heroku_ace460f1419a5da.user AS U, 
                (SELECT U.userid, U.username, U.email FROM heroku_ace460f1419a5da.user AS U) AS T
                WHERE Q.questionid = R.postID AND U.userid = R.reporter AND status = 'Pending' AND T.userid = Q.userid`;

      conn.query(sql, [], (err, result) => {
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

  listBlockedPosts(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT R.reportID, R.title, R.description 'reportDetail', R.status, U.username, Q.questionid, Q.title 'qnTitle', Q.description 
                FROM heroku_ace460f1419a5da.reports AS R, heroku_ace460f1419a5da.questions AS Q, heroku_ace460f1419a5da.user AS U
                WHERE Q.questionid = R.postID AND U.userid = R.reporter AND status IN('Blocked', 'Reject')`;

      conn.query(sql, [], (err, result) => {
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

  blockPost(questionID, block, callback) {
    const reason = block.blockReason;
    const status = block.reportStatus;

    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err); // know what the error is
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `
                UPDATE
                    heroku_ace460f1419a5da.reports
                SET
                    blockReason = ?,
                    status = ?
                WHERE
                    postID = ?;
                    `;

      conn.query(sql, [reason, status, questionID], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  rejectReport(reportID, block, callback) {
    const reason = block.blockReason;
    const status = block.reportStatus;

    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err); // know what the error is
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `
                UPDATE
                    heroku_ace460f1419a5da.reports
                SET
                    blockReason = ?,
                    status = ?
                WHERE
                    reportID = ?;
                    `;

      // eslint-disable-next-line no-shadow
      conn.query(sql, [reason, status, reportID], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  reportSearchByPost(post, callback) {
    // get a connection to the database
    const conn = db.getConnection();

    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `SELECT R.reportID, R.title, R.description 'reportDetail', R.status, U.username, U.email, Q.questionid, Q.title 'qnTitle', Q.description, T.username 'Poster', T.email 'PosterEmail'
                FROM heroku_ace460f1419a5da.reports AS R, heroku_ace460f1419a5da.questions AS Q, heroku_ace460f1419a5da.user AS U, 
                (SELECT U.userid, U.username, U.email FROM heroku_ace460f1419a5da.user AS U) AS T
                WHERE Q.questionid = R.postID AND U.userid = R.reporter AND status = 'Pending' AND T.userid = Q.userid AND Q.description LIKE ?`;

      const queryParams = [`%${post}%`];

      // eslint-disable-next-line no-shadow
      conn.query(sql, queryParams, (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  blockedSearchByPost(blocked, callback) {
    // get a connection to the database
    const conn = db.getConnection();

    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      const sql = `SELECT R.reportID, R.title, R.description 'reportDetail', R.status, U.username, Q.questionid, Q.title 'qnTitle', Q.description 
                FROM heroku_ace460f1419a5da.reports AS R, heroku_ace460f1419a5da.questions AS Q, heroku_ace460f1419a5da.user AS U
                WHERE Q.questionid = R.postID AND U.userid = R.reporter AND status IN('Blocked', 'Reject') AND Q.description LIKE ?`;

      const queryParams = [`%${blocked}%`];

      // eslint-disable-next-line no-shadow
      conn.query(sql, queryParams, (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  filterBlockedPosts(status, callback) {
    // get a connection to the DB
    const conn = db.getConnection();
    let sql;

    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      if (status === 'Reject') {
        sql = `SELECT R.reportID, R.title, R.description 'reportDetail', R.status, U.username, Q.questionid, Q.title 'qnTitle', Q.description 
                FROM heroku_ace460f1419a5da.reports AS R, heroku_ace460f1419a5da.questions AS Q, heroku_ace460f1419a5da.user AS U
                WHERE Q.questionid = R.postID AND U.userid = R.reporter AND status = ?;`;
      } else if (status === 'Blocked') {
        sql = `SELECT R.reportID, R.title, R.description 'reportDetail', R.status, U.username, Q.questionid, Q.title 'qnTitle', Q.description 
                FROM heroku_ace460f1419a5da.reports AS R, heroku_ace460f1419a5da.questions AS Q, heroku_ace460f1419a5da.user AS U
                WHERE Q.questionid = R.postID AND U.userid = R.reporter AND status = ?;`;
      }

      // eslint-disable-next-line no-shadow
      conn.query(sql, [status], (err, result) => {
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

  //    events
  // -----------------
  listEvents(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT distinct E.eventid, E.eventTitle, E.eventDescription, E.maxCapacity, u.username, count(P.participatingID) 'participantCount', 
      DATE_FORMAT(E.eventTime, '%Y-%m-%d') 'date'  
      FROM heroku_ace460f1419a5da.events AS E
      LEFT JOIN participants as P on E.eventid= P.eventid
      Inner join user as u on E.createdBy = u.userid                
      group by E.eventid`;

      // eslint-disable-next-line no-shadow
      conn.query(sql, [], (err, result) => {
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

  searchEventsFunction(searchBy, value, callback) {
    console.log(`${searchBy} ${value}`);

    // get a connection to the database
    const conn = db.getConnection();
    let sql;

    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      if (searchBy === 'Event') {
        sql = `SELECT distinct E.eventid, E.eventTitle, E.eventDescription, E.maxCapacity, u.username, count(P.participatingID) 'participantCount', 
                DATE_FORMAT(E.created_at, '%Y-%m-%d') 'date'  
                FROM heroku_ace460f1419a5da.events AS E
                LEFT JOIN participants as P on E.eventid= P.event
                Inner join user as u on E.createdBy = u.userid
                WHERE E.eventTitle LIKE ?              
                group by E.eventid`;
      } else {
        sql = `SELECT distinct E.eventid, E.eventTitle, E.eventDescription, E.maxCapacity, u.username, count(P.participatingID) 'participantCount', 
                DATE_FORMAT(E.created_at, '%Y-%m-%d') 'date'  
                FROM heroku_ace460f1419a5da.events AS E
                LEFT JOIN participants as P on E.eventid= P.event
                Inner join user as u on E.createdBy = u.userid
                WHERE username LIKE ?              
                group by E.eventid`;
      }

      const queryParams = [`%${value}%`];

      // eslint-disable-next-line no-shadow
      conn.query(sql, queryParams, (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  getEventByDate(start, end, callback) {
    // get a connection to the database
    const conn = db.getConnection();

    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('Connected!');

      if (start === '' || end === '' || (start === '' && end === '')) {
        const sql = `SELECT distinct E.eventid, E.eventTitle, E.eventDescription, E.maxCapacity, u.username, count(P.participatingID) 'participantCount', 
                    DATE_FORMAT(E.created_at, '%Y-%m-%d') 'date'  
                    FROM heroku_ace460f1419a5da.events AS E
                    LEFT JOIN participants as P on E.eventid= P.event
                    Inner join user as u on E.createdBy = u.userid                
                    group by E.eventid`;

        // eslint-disable-next-line no-shadow
        conn.query(sql, [], (err, result) => {
          conn.end();

          if (err) {
            console.log(err);
            return callback(err, null);
          }
          return callback(null, result);
        });
      } else if (start === end) {
        const sql = `SELECT distinct E.eventid, E.eventTitle, E.eventDescription, E.maxCapacity, u.username, count(P.participatingID) 'participantCount', 
                    DATE_FORMAT(E.created_at, '%Y-%m-%d') 'date'  
                    FROM heroku_ace460f1419a5da.events AS E
                    LEFT JOIN participants as P on E.eventid= P.event
                    Inner join user as u on E.createdBy = u.userid     
                    WHERE DATE_FORMAT(E.created_at, '%Y-%m-%d') = ?           
                    group by E.eventid`;

        // eslint-disable-next-line no-shadow
        conn.query(sql, [start], (err, result) => {
          conn.end();

          if (err) {
            console.log(err);
            return callback(err, null);
          }
          return callback(null, result);
        });
      } else {
        const sql = `SELECT distinct E.eventid, E.eventTitle, E.eventDescription, E.maxCapacity, u.username, count(P.participatingID) 'participantCount', 
                    DATE_FORMAT(E.created_at, '%Y-%m-%d') 'date'  
                    FROM heroku_ace460f1419a5da.events AS E
                    LEFT JOIN participants as P on E.eventid= P.event
                    Inner join user as u on E.createdBy = u.userid     
                    WHERE DATE_FORMAT(E.created_at, '%Y-%m-%d') >= ? AND DATE_FORMAT(E.created_at, '%Y-%m-%d') <= ?       
                    group by E.eventid`;

        // eslint-disable-next-line no-shadow
        conn.query(sql, [start, end], (err, result) => {
          conn.end();

          if (err) {
            console.log(err);
            return callback(err, null);
          }
          return callback(null, result);
        });
      }
    });
  },

  deleteEvent(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    // eslint-disable-next-line consistent-return
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'DELETE FROM heroku_ace460f1419a5da.events WHERE eventid = ?;';

      // eslint-disable-next-line no-shadow
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
};

//= ======================================================
//              Exports
//= ======================================================
module.exports = Admin;
