/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
//= ======================================================
//              Imports
//= ======================================================
const db = require('../controller/databaseConfig');

//= ======================================================
//              Functions / Objects
//= ======================================================
const Question = {

  displayAllQuestion(catid, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT  question.questionid, question.description, question.title
      , u.username, u.credential, category.categoryid, category.full_name, count(liked.questionid) 'upvotes', r.status
      FROM heroku_ace460f1419a5da.questions AS question
      LEFT JOIN qnlikes as liked on question.questionid = liked.questionid
      Inner join user as u on question.userid = u.userid
      INNER JOIN category ON category.categoryid = question.categoryid
      left join reports as r ON question.questionid = r.postID
      WHERE question.categoryid = ?
      group by question.userid,question.questionid
      Order by question.created_at DESC;`;

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

  displayAllQuestionSortByUpvotes(catid, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT  question.questionid, question.description, question.title
      , u.username, u.credential, category.categoryid, category.full_name, count(liked.questionid) 'upvotes', r.status
      FROM heroku_ace460f1419a5da.questions AS question
      LEFT JOIN qnlikes as liked on question.questionid = liked.questionid
      Inner join user as u on question.userid = u.userid
      INNER JOIN category ON category.categoryid = question.categoryid
      Inner join reports as r ON question.questionid = r.postID
      WHERE question.categoryid = ? and r.status != "Blocked"
      group by question.userid,question.questionid
      Order by upvotes DESC;`;

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

  displayTopQuestions(callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT distinct question.questionid, question.title, question.description, u.username, u.credential, count(liked.questionid) 'upvotes'  
                FROM heroku_ace460f1419a5da.questions AS question
                LEFT JOIN qnlikes as liked on question.questionid = liked.questionid
                Inner join user as u on question.userid = u.userid
                
                group by question.userid,question.questionid
                order by upvotes desc limit 5;`;

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

  selectQnById(qnID, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT distinct question.title, question.description, c.*, u.username, u.credential, count(liked.questionid) 'upvotes'  
                FROM heroku_ace460f1419a5da.questions AS question
                LEFT JOIN qnlikes as liked on question.questionid = liked.questionid
                Inner join user as u on question.userid = u.userid
                Inner join category as c on question.categoryid = c.categoryid
                WHERE question.questionid = ?
                group by question.userid,question.questionid;`;

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
        console.log(result);
        return callback(null, result);
      });
    });
  },

  insertQuestion(question, callback) {
    const { title } = question;
    const { description } = question;
    const { userid } = question;
    const { categoryid } = question;

    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }

      console.log('Connected!');

      const sql = `
                INSERT INTO
                    questions 
                    (title, description, userid, categoryid)
                VALUES
                    (?, ?, ?, ?);
                    `;

      conn.query(sql, [title, description, userid, categoryid], (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  deleteMyQuestion(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = 'DELETE FROM heroku_ace460f1419a5da.questions WHERE questionid = ?;';

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

  displayComments(id, callback) {
    // get a connection to the DB
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log('DB successfully connected!');

      const sql = `SELECT distinct answer.comment, u.username, answer.answerid, count(liked.ansid) 'upvotes'  
                            FROM heroku_ace460f1419a5da.answers AS answer
                            LEFT JOIN anslikes as liked on answer.answerid = liked.ansid
                            Inner join user as u on answer.userid = u.userid
                            where answer.questionid = ?
                            group by answer.userid,answer.answerid;`;

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

  updateQuestion(id, qna, callback) {
    const { userid } = qna;
    const { title } = qna;
    const des = qna.description;
    const category = qna.categoryid;
    console.log(`${userid} ${title} ${des} ${category}`);

    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err); // know what the error is
        return callback(err, null);
      }

      console.log('Connected!');

      const sql = `
                    UPDATE
                        heroku_ace460f1419a5da.questions
                    SET
                        title = ?,
                        description = ?,
                        userid = ?,
                        categoryid = ?
                    WHERE
                        questionid = ?;
                    `;

      conn.query(sql, [title, des, userid, category, id], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  // Insert Like if userid and question does not exist in the same row
  insertQuestionLike(question, callback) {
    const { userid } = question;
    const { questionid } = question;

    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }

      console.log('Connected!');

      const sql = `INSERT INTO qnlikes (userid, questionid) 
                    SELECT ?, ? FROM DUAL 
                    WHERE NOT EXISTS (SELECT * FROM qnlikes
                          WHERE userid=? AND questionid=? LIMIT 1)`;

      conn.query(sql, [userid, questionid, userid, questionid], (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  insertAnswerLike(answer, callback) {
    const { userid } = answer;
    const { answerid } = answer;

    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }

      console.log('Connected!');

      const sql = `INSERT INTO anslikes (userid, ansid) 
                    SELECT ?, ? FROM DUAL 
                    WHERE NOT EXISTS (SELECT * FROM anslikes
                          WHERE userid=? AND ansid=? LIMIT 1)`;

      conn.query(sql, [userid, answerid, userid, answerid], (err, result) => {
        conn.end();

        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  getQuestionBySearch(question, callback) {
    const { title } = question;
    const { catid } = question;

    // get a connection to the database
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }

      console.log('Connected!');

      let sql = `SELECT questions.questionid, full_name, username, credential, title, questions.description, questions.categoryid ,count(liked.questionid) 'upvotes'
                FROM heroku_ace460f1419a5da.questions 
                LEFT JOIN qnlikes as liked on questions.questionid = liked.questionid
                INNER JOIN heroku_ace460f1419a5da.user ON questions.userid = user.userid
                INNER JOIN category ON category.categoryid = questions.categoryid
                WHERE questions.categoryid = ? AND title LIKE ?
                group by questions.questionid`;

      const queryParams = [catid, `%${title}%`];

      sql += ' ORDER BY title';

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

  getAllQuestionBySearch(question, callback) {
    const { title } = question;

    // get a connection to the database
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }

      console.log('Connected!');

      let sql = `SELECT questions.questionid, full_name, username, credential, title, questions.description, questions.categoryid 
                FROM heroku_ace460f1419a5da.questions 
                INNER JOIN heroku_ace460f1419a5da.user ON questions.userid = user.userid
                INNER JOIN category ON category.categoryid = questions.categoryid
                WHERE title LIKE ?`;

      const queryParams = [`%${title}%`];

      sql += ' ORDER BY questionid';

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

  insertAnswer(answer, callback) {
    const { userid } = answer;
    const { qid } = answer;
    const { comment } = answer;

    // get a connection to the database
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err); // know what the error is
        return callback(err, null);
      }

      console.log('Connected!');

      const sql = `
                INSERT INTO 
                heroku_ace460f1419a5da.answers (
                      userid, 
                      questionid,
                      comment)
                VALUES
                    (?,?,?);
                `;

      conn.query(sql, [userid, qid, comment], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  saved(answer, callback) {
    const { userid } = answer;
    const { qid } = answer;

    // get a connection to the database
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err); // know what the error is
        return callback(err, null);
      }

      console.log('Connected!');

      const sql = `
                INSERT INTO saved (userid, questionid) 
                    SELECT ?, ? FROM DUAL 
                    WHERE NOT EXISTS (SELECT * FROM saved WHERE userid=? AND questionid=? LIMIT 1)
                `;

      conn.query(sql, [userid, qid, userid, qid], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        return callback(null, result);
      });
    });
  },

  reportQuestion(report, callback) {
    const { reportUser } = report;
    const { questionId } = report;
    const { reportTitle } = report;
    const { reportDes } = report;

    // get a connection to the database
    const conn = db.getConnection();

    conn.connect((err) => {
      if (err) {
        console.log(err); // know what the error is
        return callback(err, null);
      }

      console.log('Connected!');

      const sql = `
      INSERT INTO reports (title, description, postID, reporter) 
      SELECT ?, ?, ?, ? FROM DUAL 
      WHERE NOT EXISTS (SELECT * FROM reports WHERE reporter = ? AND postID = ? LIMIT 1)
                `;

      conn.query(sql, [reportTitle, reportDes, questionId,
        reportUser, reportUser, questionId], (err, result) => {
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
module.exports = Question;
