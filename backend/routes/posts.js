const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const posts = require("../models/posts");

// get all posts
router.get('', (req, res, next) => {
  posts.find().then((documents) => {
    res.json({
      message: "Retrieved posts",
      posts: documents.reverse(),
    });
    console.log("posts recieved");
  });
});

// POST
// create a post
router.post('', checkAuth, (req, res, next) => {
  const post = new posts({
    username: req.body.username,
    date: req.body.date,
    department: req.body.department,
    postContent: req.body.postContent,
  });

  post.save().then((createdPost) => {
    console.log("creating post ...");
    console.log(createdPost);
    res.status(201).json({
      message: "post created",
      postID: createdPost._id,
    });
  });
  console.log(post);
});

// delete a post
router.delete("/:id", checkAuth, (req, res, next) => {
  posts.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Post Deleted" });
    console.log("posts deleted from the database");
  });
});

module.exports = router;