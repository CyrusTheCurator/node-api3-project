const express = require("express");
const {
  get,
  getById,
  getUserPosts,
  insert,
  update,
  remove,
} = require("./userDb.js");
const insertPost = require("../posts/postDb.js").insert;

const router = express.Router();
const postRouter = require("../posts/postRouter");
router.use("/:id/posts", IdPasser, postRouter);

router.post("/", validateUser, (req, res) => {
  // do your magic!

  insert(req.body)
    .then((user) => {
      res
        .status(200)
        .json({ message: "User posted successfully!", user: user });
    })
    .catch((err) => {
      if (err.errno === 19) {
        res.status(500).json({
          message: "A user with that name already exists in the database",
          err: err,
        });
      }
      res.status(500).json({ message: "unable to post user", err: err });
    });
});

router.post("/:id/posts", validatePost, (req, res) => {
  // do your magic!
  console.log("your post was validated, dude");
  const { id } = req.params;
  const post = req.body;
  post.user_id = id;

  console.log(post);
  insertPost(post)
    .then((post) => {
      console.log(post);
      res.status(200).json({ message: "Post successful", postObj: post });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "something bad happened... sorry?", err: err });
    });
});

router.get("/", (req, res) => {
  // do your magic!

  get()
    .then((users) => {
      res.status(200).json({ message: "All users on server", users: users });
    })
    .catch((err) => {});
});

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;

  getById(id)
    .then((user) => {
      console.log(user);
      if (user) {
        res
          .status(200)
          .json({
            message: `user is ${user.name}, id is ${id}`,
            userObj: user,
          });
      } else {
        res.status(404).json({ message: "User with this ID does not exist" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "something bad happened... sorry?", err: err });
    });
});

router.get("/:id/posts", (req, res) => {
  // do your magic!
  const { id } = req.params;

  getUserPosts(id)
    .then((posts) => {
      console.log(posts);
      res.status(200).json({ message: `posts retrieved`, posts: posts });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "something bad happened... sorry?", err: err });
    });
});

router.delete("/:id", (req, res) => {
  // do your magic!
  const { id } = req.params;

  remove(id)
    .then((user) => {
      res
        .status(200)
        .json({ message: `Successfully deleted user ${user.name}` });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "something bad happened... sorry?", err: err });
    });
});

router.put("/:id", (req, res) => {
  // do your magic!
  const { id } = req.params;
  const changes = req.body;
  update(id, changes)
    .then((user) => {
      console.log(user);
      res.status(200).json({
        message: `Successfully modified user ${id}`,
        newUserObj: changes,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "something bad happened... sorry?", err: err });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  console.log("searching for user...\n");
  const gotten = getById(id)
    .then((user) => {
      if (res.name) {
        console.log(`User Found! Name: ${user.name}`);
        req.user = user;
      }
      // else{res.status()}
    })
    .catch((err) => {
      res.status(404).json({ err: err, message: "404, user not found" });
    });
  next();
}

function validateUser(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({
      message:
        "Please provide a JSON body to your request containing a name: property",
    });
  } else if (!req.body.name || !req.body.name.length > 0) {
    res.status(400).json({
      message: "please include a 'name' property with at least one character",
    });
  } else {
    console.log("New User Post successfully validated");
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({
      message:
        "Please provide a JSON body to your request containing a text: property",
    });
  } else if (!req.body.text || !req.body.text.length > 0) {
    res.status(400).json({
      message: "please include a 'text' property with at least one character",
    });
  } else {
    console.log("Post successfully validated");
    next();
  }
}

function IdPasser(req, res, next) {
  const { id } = req.params;
  req.userId = id;

  console.log(req.userId);
  next();
}

module.exports = router;
