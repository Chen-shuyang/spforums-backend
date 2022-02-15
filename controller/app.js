/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */

//= ======================================================
//              Imports
//= ======================================================
const express = require('express');

const app = express();

const bodyParser = require('body-parser');
// const createHttpErrors = require('http-errors');
const cors = require('cors');
const speakeasy = require('speakeasy');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const uuid = require('uuid');

const udb = new JsonDB(new Config('myDataBase', true, false, '/'));
const { OAuth2Client } = require('google-auth-library');
const verifyToken = require('../auth/isLoggedInMiddleWare');

// model
const Profile = require('../model/profile');
const userLogSign = require('../model/userLogSign');
const School = require('../model/school');
const Question = require('../model/question');
const Admin = require('../model/admin');
const story = require('../model/story');
const Event = require('../model/event');
// const { parse } = require('dotenv');

// Google Auth Library
const CLIENT_ID = '370180577092-24sie7netu2b0vg8a0a523pumd2tvaol.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

// var verifyToken = require('../auth/verifyToken.js');
// const { JsonWebTokenError } = require('jsonwebtoken');
// const { verify } = require('../model/user.js');

// MF function
/**
 * prints useful debugging information about an endpoint we are going to service
 *
 * @param {object} req
 *   request object
 *
 * @param {object} res
 *   response object
 *
 * @param {function} next
 *   reference to the next function to call
 */

//= ======================================================
//              MiddleWare Functions
//= ======================================================
function printDebugInfo(req, res, next) {
  console.log();
  console.log('-----------------[Debug Info]----------------');
  // console.log(`Servicing ${urlPattern} ..`);
  console.log(`Servicing ${req.url}..`);

  console.log(`> req.params:${JSON.stringify(req.params)}`);
  console.log(`> req.body:${JSON.stringify(req.body)}`);
  // console.log("> req.myOwnDebugInfo:" + JSON.stringify(req.myOwnDebugInfo));

  console.log('---------------[Debug Info Ends]----------------');
  console.log();

  next();
}

const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

// MF Configurations
app.use(urlEncodedParser);
app.use(jsonParser);

app.options('*', cors());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('HelloWorld');
});
//= ======================================================
//              Profiling
//= ======================================================

// Get user profile
app.get('/user/:userid', printDebugInfo, verifyToken, (req, res, next) => {
  const userid = parseInt(req.params.userid, 10);
  console.log(userid);

  if (isNaN(userid)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (userid !== req.decoded.userid) {
    console.log(`req.decoded.userid = ${req.decoded.userid}`);
    console.log(`userid: ${userid}`);
    res.status(403).send();
    return;
  }

  Profile.findUserByUserID(userid, (err, result) => {
    if (!err) {
      console.log(`result: ${result}`);
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

// Get my Questions
app.get('/userquestions/:id', printDebugInfo, verifyToken, (req, res, next) => {
  const userid = parseInt(req.params.id, 10);

  if (isNaN(userid)) {
    console.log(userid);
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (userid !== req.decoded.userid) {
    console.log(`req.decoded.userid = ${typeof (req.decoded.userid)}`);
    res.status(403).send();
    return;
  }

  Profile.findUserPostedQn(userid, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// Sort my Questions by Upvote
app.get('/userquestions/:id/sortbyupvote', verifyToken, printDebugInfo, (req, res, next) => {
  const userid = parseInt(req.params.id, 10);

  if (isNaN(userid)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (userid !== req.decoded.userid) {
    console.log(`req.decoded.userid = ${typeof (req.decoded.userid)}`);
    res.status(403).send();
    return;
  }

  Profile.findUserPostedQnSortByUpvotes(userid, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

// Sort my Questions by Recent
app.get('/userquestions/:id/sortbyrecent', verifyToken, printDebugInfo, (req, res, next) => {
  const userid = parseInt(req.params.id, 10);

  if (isNaN(userid)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (userid !== req.decoded.userid) {
    console.log(`req.decoded.userid = ${typeof (req.decoded.userid)}`);
    res.status(403).send();
    return;
  }

  Profile.findUserPostedQnSortByRecent(userid, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

// Get user saved questions
app.get('/usersavedqn/:id', printDebugInfo, verifyToken, (req, res, next) => {
  console.log('saved questions');
  const userid = parseInt(req.params.id, 10);

  if (isNaN(userid)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (userid !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  Profile.findUserSavedQn(userid, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// Get user liked questions
app.get('/userlikeqn/:id', printDebugInfo, verifyToken, (req, res, next) => {
  const userid = parseInt(req.params.id, 10);

  if (isNaN(userid)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (userid !== req.decoded.userid) {
    console.log(`req.decoded.userid = ${typeof (req.decoded.userid)}`);
    res.status(403).send();
    return;
  }

  Profile.findUserLikeQn(userid, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// Get user liked answers
app.get('/userlikeans/:id', printDebugInfo, verifyToken, (req, res, next) => {
  const userid = parseInt(req.params.id, 10);
  if (isNaN(userid)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (userid !== req.decoded.userid) {
    console.log(`req.decoded.userid = ${typeof (req.decoded.userid)}`);
    res.status(403).send();
    return;
  }

  Profile.findUserLikeAns(userid, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// update profile
app.put('/users/:id', printDebugInfo, verifyToken, (req, res, next) => {
  const userid = parseInt(req.params.id, 10);

  if (isNaN(userid)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (userid !== req.decoded.userid) {
    console.log(`req.decoded.userid = ${typeof (req.decoded.userid)}`);
    res.status(403).send();
    return;
  }

  const data = {
    username: req.body.username,
    email: req.body.email,
    school: req.body.school,
    credential: req.body.credential,
    description: req.body.description,
    employment: req.body.employment,
    hobbies: req.body.hobbies,
    location: req.body.location,
  };

  Profile.updateProfile(userid, data, (err, result) => {
    if (!err) {
      console.log('Update successful!: Result\n', result);
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

// unsave questions
app.delete('/unsave/:userid/:id', printDebugInfo, verifyToken, (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const userid = parseInt(req.params.userid, 10);

  if (isNaN(userid)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (userid !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  Profile.unsaveQuestions(id, (err, result) => {
    if (!err) {
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.send(output);
    } else {
      return next(err);
    }
  });
});

// dislike questions
app.delete('/dislikeqns', printDebugInfo, verifyToken, (req, res, next) => {
  const id = parseInt(req.body.userid, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    userid: id,
    questionid: req.body.questionid,
  };

  Profile.dislikeQns(data, (err, result) => {
    if (!err) {
      res.status(200).json({
        qustionid: result.questionid,
        rowsAffected: result.affectedRows,
      });

      console.log(result);
    } else {
      console.log(`This is dislike Data: ${JSON.stringify(data)}`);
      return next(err);
    }
  });
});

// dislike questions
app.delete('/dislikeans', printDebugInfo, verifyToken, (req, res, next) => {
  const id = parseInt(req.body.userid, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    userid: id,
    answerid: req.body.answerid,
  };

  Profile.dislikeAns(data, (err, result) => {
    if (!err) {
      res.status(200).json({
        qustionid: result.questionid,
        rowsAffected: result.affectedRows,
      });

      console.log(result);

      // res.status(201).json("This like is success")
    } else {
      console.log(`This is dislike Data: ${JSON.stringify(data)}`);
      return next(err);
    }
  });
});

//= ======================================================
//              Login Signup
//= ======================================================

// user login
app.post('/login', (req, res, next) => {
  // extract data
  const { username } = req.body;
  const { password } = req.body;
  const { secrets } = req.body;
  // const { user2fa } = req.body;

  const secretToken = parseInt(secrets, 10);
  console.log(`username: ${username}, password: ${password}`);

  userLogSign.verify(username, password, (err, token, result) => {
    if (err) {
      // matched with callback (err, null)
      console.log(err);
      res.status(500);
      res.send(err.statusCode);
      return next(err);
    }

    let msg;
    if (!result) {
      // matched with callback(null, null)
      msg = {
        Error: 'Invalid login',
      };
      res.status(404).send(msg);
    } else {
      console.log(`Token: ${result}`);
      // matched with callback(null, result)
      const userData = result.secret;
      console.log(`secretss: ${userData}`);
      console.log(`sec: ${secretToken}`);
      console.log(typeof (secretToken));
      const verified = speakeasy.totp.verify({
        userData,
        encoding: 'base32',
        secretToken,
      });
      console.log(`CHECKKK${verified}`);
      msg = {
        userid: result.userid,
        username: result.username,
        token,
        role: result.roleName,
        secret: result.secret,
      };
      res.status(200).send(msg);
    }
  });
});

// register new user
app.post('/register', printDebugInfo, (req, res, next) => {
  const tempSecret = speakeasy.generateSecret();
  const id = uuid.v4();
  // try {
  const path = `/user/${id}`;

  // Create user in the database
  udb.push(path, { id, tempSecret });

  // } catch(e) {
  //   console.log(e);
  //   res.status(500).json({ message: 'Error generating secret key'})
  // }
  const data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.pwd,
    school: req.body.school,
    secret: tempSecret.base32,
  };

  console.log(JSON.stringify(data.school));

  // eslint-disable-next-line no-unused-vars
  userLogSign.register(data, (err, result) => {
    if (!err) {
      res.status(201).send({ success: true, Data: data });
      console.log(data);
    } else {
      return next(err);
    }
  });
});

app.post('/oauth/login', (req, res, next) => {
  const { token } = req.body;
  let payload; let
    username;
  console.log(token);

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    payload = ticket.getPayload();
    console.log(payload);

    username = payload.name;
  }
  verify()
    .then(() => {
      // eslint-disable-next-line no-shadow
      userLogSign.oauthVerify(username, (err, token, result) => {
        if (err) {
          // matched with callback (err, null)
          console.log(err);
          res.status(500);
          return next(err);
        }

        let msg;
        if (!result) {
          // matched with callback(null, null)
          msg = {
            Error: 'Invalid login',
          };
          res.status(404).send(msg);
        } else {
          // matched with callback(null, result)
          msg = {
            userid: result.userid,
            username: payload.name,
            picture: payload.picture,
            token,
            role: result.roleName,
          };
          console.log(token);
          console.log(msg.userid);
          res.send(msg);
        }
      });
    })
    .catch(console.error);
});

app.post('/oauth', (req, res) => {
  const { token } = req.body;
  let payload; let
    userid;

  console.log(token);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    payload = ticket.getPayload();
    userid = parseInt(payload.sub, 10);
  }
  verify()
    .then(() => {
      const result = {
        googleid: userid,
        username: payload.name,
        picture: payload.picture,
        email: payload.email,
        success: true,
      };
      res.send(result);
    })
    .catch(console.error);
});

app.post('/oauth/register', (req, res, next) => {
  const data = {
    googleID: req.body.googleID,
    email: req.body.email,
    username: req.body.username,
    school: req.body.school,
  };
  console.log(data.googleID);

  // eslint-disable-next-line no-unused-vars
  userLogSign.registerGoogle(data, (err, result) => {
    if (!err) {
      res.status(201).send({ success: true });
    } else {
      return next(err);
    }
  });
});

//= ======================================================
//              School
//= ======================================================

// list schools
app.get('/school', printDebugInfo, (req, res, next) => {
  School.findSchool((err, result) => {
    if (!err) {
      console.log(`result: ${result}`);
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

// find a specific school
app.get('/school/:id', printDebugInfo, (req, res, next) => {
  const { id } = req.params;

  School.findSchoolByID(id, (err, result) => {
    if (!err) {
      console.log(`result: ${result}`);
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

//= ======================================================
//              Question
//= ======================================================

// get all questions withina a school
app.get('/qna/:id', printDebugInfo, (req, res, next) => {
  const { id } = req.params;

  Question.displayAllQuestion(id, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// get all questions within a school and sort by upvotes
app.get('/qna/sortbyupvotes/:id', printDebugInfo, (req, res, next) => {
  const { id } = req.params;

  Question.displayAllQuestionSortByUpvotes(id, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// get top 3 questions
app.get('/qna', printDebugInfo, (req, res, next) => {
  Question.displayTopQuestions((err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// get specific question details
app.get('/qnadetails/:qid', printDebugInfo, (req, res, next) => {
  const qnID = req.params.qid;

  Question.selectQnById(qnID, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// post a new question
app.post('/qna', printDebugInfo, verifyToken, (req, res, next) => {
  const id = parseInt(req.body.userid, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    title: req.body.title,
    description: req.body.description,
    userid: id,
    categoryid: req.body.categoryid,
  };

  Question.insertQuestion(data, (err, result) => {
    if (!err) {
      res.status(201).json({ qustionid: result.qustionid });
    } else {
      return next(err);
    }
  });
});

// delete my question
app.delete('/questions/:userid/:id', printDebugInfo, verifyToken, (req, res, next) => {
  const qnId = parseInt(req.params.id, 10);
  const userid = parseInt(req.params.userid, 10);

  if (isNaN(userid)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (userid !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  Question.deleteMyQuestion(qnId, (err, result) => {
    if (!err) {
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

// get comments for a specific question
app.get('/comments/:id', printDebugInfo, (req, res, next) => {
  const { id } = req.params;

  Question.displayComments(id, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

// report posts
app.post('/qnadetails/report', printDebugInfo, verifyToken, (req, res, next) => {
  const userId = parseInt(req.body.reportUser, 10);

  if (isNaN(userId)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (userId !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    reportUser: userId,
    questionId: req.body.questionID,
    reportTitle: req.body.reportTitle,
    reportDes: req.body.reportDes,
  };

  Question.reportQuestion(data, (err, result) => {
    if (!err) {
      console.log(result.affectedRows);
      res.status(201).json({
        qustionid: result.questionid,
        rowsAffected: result.affectedRows,
      });
    } else {
      return next(err);
    }
  });
});

// edit questions
app.put('/qna/:id', printDebugInfo, verifyToken, (req, res, next) => {
  const qnID = parseInt(req.params.id, 10);
  const id = parseInt(req.body.userid, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    title: req.body.title,
    description: req.body.des,
    categoryid: req.body.catid,
    userid: id,
  };

  Question.updateQuestion(qnID, data, (err, result) => {
    if (!err) {
      console.log('Update successful!: Result\n', result);
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(201).send(output);
    } else {
      return next(err);
    }
  });
});

// like a quesion
app.post('/likeqns', printDebugInfo, verifyToken, (req, res, next) => {
  const id = parseInt(req.body.userid, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    userid: id,
    questionid: req.body.questionid,
  };

  Question.insertQuestionLike(data, (err, result) => {
    if (!err) {
      console.log(result.affectedRows);
      res.status(201).json({
        qustionid: result.questionid,
        rowsAffected: result.affectedRows,
      });
      // res.status(201).json("This like is success")
    } else {
      console.log(`This is likeqns/ Data: ${JSON.stringify(data)}`);
      return next(err);
    }
  });
});

// like a answer
app.post('/likeans', printDebugInfo, verifyToken, (req, res, next) => {
  const id = parseInt(req.body.userid, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    userid: id,
    answerid: req.body.answerid,
  };

  Question.insertAnswerLike(data, (err, result) => {
    if (!err) {
      console.log(result);
      res.status(201).json({
        answerid: result.ansid,
        rowsAffected: result.affectedRows,
      });
      // res.status(201).json("This like is success")
    } else {
      console.log(`This is /likeans Data: ${JSON.stringify(data)}`);
      return next(err);
    }
  });
});

// general search for all questions
app.post('/qna/title', printDebugInfo, (req, res, next) => {
  const data = {
    title: req.body.title,
  };

  Question.getAllQuestionBySearch(data, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// save a question
app.post('/qnadetails/:qid/saved/:userid', printDebugInfo, verifyToken, (req, res, next) => {
  const id = parseInt(req.params.userid, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    userid: id,
    qid: req.params.qid,
  };

  Question.saved(data, (err, result) => {
    if (!err) {
      res.status(201).send(result);
    } else {
      console.log(err);
      return next(err);
    }
  });
});

//= ======================================================
//              answer
//= ======================================================

// post a comment
app.post('/qnadetails/:qid/:userid', printDebugInfo, verifyToken, (req, res, next) => {
  const id = parseInt(req.params.userid, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    userid: id,
    comment: req.body.comment,
    qid: req.params.qid,
  };

  // eslint-disable-next-line no-unused-vars
  Question.insertAnswer(data, (err, result) => {
    if (!err) {
      res.status(201).send({ success: true });
    } else {
      return next(err);
    }
  });
});

// get comments to a question post
app.get('/comments/:id', printDebugInfo, (req, res, next) => {
  const { id } = req.params;

  Question.displayComments(id, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

//= ======================================================
//              Event
//= ======================================================
// get all events
app.get('/events', printDebugInfo, (req, res, next) => {
  Event.displayAllEvents((err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// get event id details
app.get('/event/:eid', printDebugInfo, (req, res, next) => {
  const eventID = req.params.eid;

  Event.displayEventByID(eventID, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// post a new event
app.post('/newevent', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const data = {
    eventTitle: req.body.eventTitle,
    eventDescription: req.body.eventDescription,
    eventTime: req.body.eventTime,
    eventDuration: req.body.eventDuration,
    maxCapacity: req.body.maxCapacity,
    userid: req.body.userid,
  };

  Event.insertEvent(data, (err, result) => {
    if (!err) {
      res.status(201).json({ eventid: result.eventid });
    } else {
      return next(err);
    }
  });
});

// delete event
app.delete('/events/:userid/:eid', printDebugInfo, verifyToken, (req, res, next) => {
  const eventid = parseInt(req.params.eid, 10);
  const userid = parseInt(req.params.userid, 10);

  if (isNaN(userid)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (userid !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  Event.deleteEvent(eventid, (err, result) => {
    if (!err) {
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

// edit event
app.put('/events/:eid', printDebugInfo, verifyToken, (req, res, next) => {
  const eventid = parseInt(req.params.eid, 10);
  const id = parseInt(req.body.userid, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    title: req.body.title,
    description: req.body.des,
    categoryid: req.body.catid,
    userid: req.body.userid,
  };

  Event.updateEvent(eventid, data, (err, result) => {
    if (!err) {
      console.log('Update successful!: Result\n', result);
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(201).send(output);
    } else {
      return next(err);
    }
  });
});

// join an event
app.post('/joinEvent', printDebugInfo, verifyToken, (req, res, next) => {
  const id = parseInt(req.body.userid, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    userid: id,
    eventid: req.body.eventid,
  };

  Event.joinEvent(data, (err, result) => {
    if (!err) {
      console.log('Dataaa', data);
      res.status(201).json({
        eventid: result.eventid,
        rowsAffected: result.affectedRows,
      });
      // res.status(201).json("This event is joined successfully")
    } else {
      return next(err);
    }
  });
});

//= ======================================================
//              Dashboard
//= ======================================================
// get no. of users
app.get('/usercount', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  Admin.numberOfUsers((err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

// get no. of posts
app.get('/postcount', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  Admin.numberOfPosts((err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

// get no. of stories
app.get('/storycount', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  Admin.numberOfStories((err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

// get no. of events
app.get('/eventcount', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  Admin.numberOfEvents((err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

// get top 10 stories
app.get('/stories/topten', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  Admin.topTenStories((err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// get top 10 posts
app.get('/posts/topten', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  Admin.topTenQuestions((err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

//= ======================================================
//              Posts Management (Admin)
//= ======================================================

// get questions by upvotes
app.get('/topqns', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  Admin.listQnByUpvotes((err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// search questions with date
app.post('/qna/date', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const startDate = req.body.start;
  const endDate = req.body.end;

  Admin.getPostByDate(startDate, endDate, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// search questions with username
app.post('/qna/user', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const username = req.body.poster;

  Admin.getPostByUserSearch(username, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// delete questions
app.delete('/qna/:id', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const qnId = parseInt(req.params.id, 10);

  Question.deleteMyQuestion(qnId, (err, result) => {
    if (!err) {
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

//= ======================================================
//              Story Management (Admin)
//= ======================================================

// get top 3 story
app.get('/latestStory', printDebugInfo, (req, res, next) => {
  story.displayTopStory((err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// search stories with username
app.post('/story/user', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const username = req.body.poster;

  Admin.getStoriesByUserSearch(username, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// get stories by likes
app.get('/topstories', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  Admin.listStoriesByUpvotes((err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// search Stories with date
app.post('/story/date', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const startDate = req.body.start;
  const endDate = req.body.end;

  Admin.getStoriesByDate(startDate, endDate, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// delete my stories
app.delete('/story/:id', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const storyId = parseInt(req.params.id, 10);

  Admin.deleteMyStory(storyId, (err, result) => {
    if (!err) {
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

//= ======================================================
//              Team Management (Admin)
//= ======================================================

// get all users
app.get('/allusers', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  Admin.getAllUsersInfo((err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// get all users by role
app.get('/role/:rolename', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const admin = req.params.rolename;

  Admin.getAllUserByRole(admin, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// search user with username
app.post('/username', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const { username } = req.body;

  Admin.getUserByUserSearch(username, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// get all user roles
app.get('/roles', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  Admin.getUserRoles((err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// delete role
app.delete('/roles/:id', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const qnId = parseInt(req.params.id, 10);

  Admin.deleteRole(qnId, (err, result) => {
    if (!err) {
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

// delete users
app.delete('/user/:id', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const userId = parseInt(req.params.id, 10);

  Admin.deleteUser(userId, (err, result) => {
    if (!err) {
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

// add new groups
app.post('/newrole', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const data = {
    roleName: req.body.roleN,
    roleDes: req.body.roleD,
  };

  Admin.addUserRoles(data, (err, result) => {
    if (!err) {
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

// update role
app.put('/newroles', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const data = {
    userID: req.body.user,
    role: req.body.role,
  };

  Admin.updateUserRole(data, (err, result) => {
    if (!err) {
      console.log('Update successful!: Result\n', result);
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

// update group
app.put('/newgrp/:roleId', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const { roleId } = req.params;

  const data = {
    role: req.body.grpName,
    roleDes: req.body.grpDes,
  };

  Admin.updateRoles(roleId, data, (err, result) => {
    if (!err) {
      console.log('Update successful!: Result\n', result);
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

//= ======================================================
//              Reports Management (Admin)
//= ======================================================

// get pending reports
app.get('/reports', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  Admin.listReports((err, result) => {
    if (!err) {
      if (result == null) {
        console.log(result);
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// get blocked or rejected reports
app.get('/blockedposts', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  Admin.listBlockedPosts((err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// block Posts
app.put('/block/:qnId', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const questionID = req.params.qnId;

  const data = {
    blockReason: req.body.reason,
    reportStatus: req.body.status,
  };

  Admin.blockPost(questionID, data, (err, result) => {
    if (!err) {
      console.log('Update successful!: Result\n', result);
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

// reject Posts
app.put('/reject/:reportId', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const reportID = req.params.reportId;

  const data = {
    blockReason: req.body.reason,
    reportStatus: req.body.status,
  };

  Admin.rejectReport(reportID, data, (err, result) => {
    if (!err) {
      console.log('Update successful!: Result\n', result);
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

// search reports with post
app.post('/report', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const { post } = req.body;

  Admin.reportSearchByPost(post, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// search reports with post
app.post('/blockedposts', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const blocked = req.body.blockedPosts;

  Admin.blockedSearchByPost(blocked, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// filter posts by status
app.get('/filterposts/:status', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const { status } = req.params;

  Admin.filterBlockedPosts(status, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

//= ======================================================
//              Events Management (Admin)
//= ======================================================

// get all events
app.get('/admin/events', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  Admin.listEvents((err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// search events with date
app.post('/events/date', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const startDate = req.body.start;
  const endDate = req.body.end;

  Admin.getEventByDate(startDate, endDate, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// search events
app.post('/events/search', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const searchInput = req.body.input;
  const { searchFilter } = req.body;

  Admin.searchEventsFunction(searchFilter, searchInput, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// delete event
app.delete('/events/:id', printDebugInfo, verifyToken, (req, res, next) => {
  if (isNaN(req.decoded.userid)) {
    res.status(403).send('forbidden');
    return;
  } if (req.decoded.role !== 'Admin') {
    res.status(403).send('forbidden');
    return;
  }

  const evenId = parseInt(req.params.id, 10);

  Admin.deleteEvent(evenId, (err, result) => {
    if (!err) {
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

//= ======================================================
//              Error Handler
//= ======================================================
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error);
  return res.status(error.status || 500).json({
    error: error.message || 'Unknown Error!',
    status: error.status || 500,
  });
});

//= ======================================================
//              story
//= ======================================================

app.get('/story', printDebugInfo, (req, res, next) => {
  story.displayAllStory((err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

app.get('/story/:storyID', printDebugInfo, (req, res, next) => {
  const { storyID } = req.params;

  story.selectStoryById(storyID, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

app.get('/userstory/:userid', printDebugInfo, verifyToken, (req, res, next) => {
  const id = parseInt(req.params.userid, 10);

  if (isNaN(id)) {
    console.log(id);
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    console.log(`req.decoded.userid = ${req.decoded.userid}`);
    console.log(`userid: ${id}`);
    res.status(403).send();
    return;
  }

  story.selectStoryByUserID(id, (err, result) => {
    if (!err) {
      if (result == null) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    } else {
      return next(err);
    }
  });
});

// get comments for a specific question
app.get('/storyComments/:storyID', printDebugInfo, (req, res, next) => {
  const id = req.params.storyID;

  story.displayStoryComments(id, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

app.post('/addStory', printDebugInfo, verifyToken, (req, res, next) => {
  const id = parseInt(req.body.userId, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }
  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    title: req.body.title,
    description: req.body.description,
    userId: id,
    story: req.body.story,
  };

  story.insertStory(data, (err, result) => {
    if (!err) {
      res.status(201).json({ storyId: result.storyId });
    } else {
      return next(err);
    }
  });
});

app.delete('/userstory/:storyID/:userId', printDebugInfo, verifyToken, (req, res, next) => {
  const storyID = parseInt(req.params.storyID, 10);
  const id = parseInt(req.params.userId, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }
  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  story.deleteStory(storyID, (err, result) => {
    if (!err) {
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

app.put('/story/:storyId', printDebugInfo, verifyToken, (req, res, next) => {
  const { storyId } = req.params;
  const id = parseInt(req.body.userId, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    title: req.body.title,
    description: req.body.description,
    story: req.body.story,
  };

  story.updateStory(storyId, data, (err, result) => {
    if (!err) {
      console.log('Update successful!: Result\n', result);
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(200).send(output);
    } else {
      return next(err);
    }
  });
});

// post a comment
app.post('/story/:storyID/:userID', printDebugInfo, verifyToken, (req, res, next) => {
  const id = parseInt(req.params.userID, 10);

  if (isNaN(id)) {
    res.status(401).send();
    return;
  }

  // user ID in the request params should be the same as the logged in user ID
  if (id !== req.decoded.userid) {
    res.status(403).send();
    return;
  }

  const data = {
    userID: id,
    comment: req.body.comment,
    storyID: req.params.storyID,

  };

  story.insertStoryComments(data, (err, result) => {
    if (!err) {
      res.status(201).send(result);
    } else {
      return next(err);
    }
  });
});

// module exports
module.exports = app;
