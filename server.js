const express = require('express');

const postRouter = require('./posts/postRouter.js');
const userRouter = require('./users/userRouter.js');


const helmet = require('helmet');
// const morgan = require('morgan');

const server = express();

server.use(express.json());
server.use(helmet());

server.use(logger);

// server.use(morgan('dev'));

server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const date = new Date()
  console.log(`${req.method}, ${req.url}, ${res.statusCode}, ${date}`);
  next();
};


module.exports = server;
