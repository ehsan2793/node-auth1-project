// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const User = require('../users/users-model');
const router = require('express').Router();
const bycrypt = require('bcryptjs');
const {
  checkUsernameFree,
  checkPasswordLength,
  checkUsernameExists,
} = require('./auth-middleware');
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

router.post(
  '/register',
  checkPasswordLength,
  checkUsernameFree,
  async (req, res, next) => {
    const { username, password } = req.body;
    const hash = bycrypt.hashSync(password, 5)
    User.add({ username: username, password: hash })
      .then(save => {
        console.log(save);
        res.status(200).json(save);
      }).catch(next)
  }
);

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
router.post('/login', checkUsernameExists, (req, res, next) => {
  const { password } = req.body
  if (bycrypt.compareSync(password, req.user.password)) {
    req.session.user = req.user;
    res.status(200).json({ message: `Welcome ${req.body.username}!` });
  } else {
    next({
      status: 401, message: 'Invalid credentials'
    })
  }

});

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
router.get('/logout', (req, res) => {
  res.status(200).json('logout');
});

module.exports = router;

// Don't forget to add the router to the `exports` object so it can be required in other modules
