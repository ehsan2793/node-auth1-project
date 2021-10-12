const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const userRouter = require("./users/users-router")
const authRouter = require("./auth/auth-router")
const session = require('express-session')
const Store = require('connect-session-knex')(session);



const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session({
  name: 'chocolatechip',
  secret: 'keep this secret!', // should come from process.env.SECRET
  cookie: {
    maxAge: 1000 * 60 * 60,
    // secure: process.env.IS_PROD ? true : false, // true would mean cookies work only over HTTPS
    secure: false,
    httpOnly: false, // whether client JS can read the cookie
  },
  rolling: true,
  resave: false, // some session libs for storing the sessions in a db require this to be true
  saveUninitialized: false, // if false no session is persisted unless client says so
  store: new Store({
    knex: require('../data/db-config'),
    tablename: 'sessions',
    sidfieldname: 'foo',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  })
}))

server.use('/api/users', userRouter)
server.use('/api/auth', authRouter)



server.get("/", (req, res) => {
  res.json({ api: "up" });
});


server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
