const express = require("express");

const router = express.Router();
const { get, getById, update, remove } = require("./postDb.js");

router.get("/", (req, res) => {
  // do your magic!
  const userId = req.userId;

  get()
    .then((posts) => {
      posts = posts.filter((post) => {
        return parseInt(userId) === parseInt(post.user_id);
      });

      res.status(200).json({ message: "here are your posts", posts: posts });
    })
    .catch((err) => {
      res.status(500).json({
        message: "error encountered, whoops",
        err: err,
      });
    });
});

router.get("/:id", (req, res) => {
  // do your magic!
  const { id } = req.params;
  let posts;
  const userId = req.userId;

  // getById(id)
  //   .then((post) => {
  //     res.status(200).json({ message: "here are your comments", post: post });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       message: "error encountered, whoops",
  //       err: err,
  //     });
  //   });

  get()
    .then((returnedPosts) => {
      posts = returnedPosts;
      posts = posts.filter((post) => {
        return parseInt(userId) === parseInt(post.user_id);
      });

      res.status(200).json({ posts: posts[id - 1] });
    })
    .catch((err) => {
      res.status(500).json({
        message: "error encountered, whoops",
        err: err,
      });
    });
});

router.delete("/:id", (req, res) => {
  // do your magic!
  const { id } = req.params;

  remove(id).then((post) => {
    res.status(200).json({ message: "post deleted", post: post });
  });
});

router.put("/:id", (req, res) => {
  // do your magic!
  const { id } = req.params;

  update(id).then((post) => {
    res.status(200).json({ message: "post updated", post: post });
  });
});

// custom middleware

module.exports = router;
