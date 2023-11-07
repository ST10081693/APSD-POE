const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressBrute = require("express-brute");
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);

router.post("/signup", bruteforce.prevent, (req, res) => {
  // hashing the users password
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      username: req.body.username,
      password: hash,
      department: req.body.department,
    });

    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created",
          result: result,
        });
        console.log("user created\n" + result);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
        console.log(err.message);
      });
  });
});

// post methdd used for user login
router.post("/login", bruteforce.prevent, (req, res) => {
  let fetchedUser;

  // checks the database to see if the username exists
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication Failture",
        });
      }

      fetchedUser = user;

      // if the user exists , compare the current users password entered with the password in the database
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Authentication Failture",
        });
      }

      // if the login password is valid , a jwd is generated
      const token = jwt.sign(
        {
          username: fetchedUser.username,
          department: fetchedUser.department,
        },
        "secret_this_should_be_longer_time_is",

        //token is given an expiry time to help prevent session jacking
        { expiresIn: "1h" }
      );

      res.status(200).json({ token: token });
    })
    .catch((err) => {
      return res.status(201).json({
        message: "Authentication Failture",
      });
    });
});

module.exports = router;