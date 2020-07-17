const express = require('express');

const userDb = require('./userDb.js');
const postDb = require('../posts/postDb.js');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  userDb.add(req.body)
    .them(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error adding User"});
    });
});

router.post('/:id/posts', validatePost, (req, res) => {
  const { id } = req.params;
  const newPost = req.body;
  newPost.user_id = id;

  postDb.insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(() => next({ code: 500, message: "Error creating a new post" }));
});

router.get('/', (req, res) => {
  userDb.get()
    .then(users => res.json(users))
    .catch(() => next({ code: 500, message: "There was an error retrieving users." }));
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  userDb.getUserPosts(req.params.id)
    .then(posts => {
      res.json(posts);
    })
    .catch(() => next({ code: 500, message: "Error retrieving the user's posts" }));
});

router.delete('/:id', validateUserId, (req, res) => {
  userDb.remove(req.params.id)
    .then(removedCount => {
      res.status(204).json({ removed: removedCount });
    })
    .catch(() => next({ code: 500, message: "There was an error removing the user." }));
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  changes.id = id;

  userDb.update(id, changes)
    .then(updatedCount => {
        res.status(200).json(updatedCount);
    })
    .catch(() => next({ code: 500, message: "There was an error updating the user data" }));
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  Users.findById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: 'User does not exist'});
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'error', err});
    });
}

function validateUser(req, res, next) {
  if(!req.body) {
    next({ code: 400, message: "missing user data" });
} else if (!req.body.name) {
    next({ code: 400, message: "missing required name field" });
} else {
    next();
}
}

function validatePost(req, res, next) {
  if(!req.body) {
    next({ code: 400, message: "missing post data" });
} else if (!req.body.text) {
    next({ code: 400, message: "missing required text field" });
} else {
    next();
}
}

module.exports = router;
