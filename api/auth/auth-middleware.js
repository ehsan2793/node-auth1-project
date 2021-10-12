const { findBy, } = require('../users/users-model')


/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/

function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({
      status: 401, message: "You shall not pass!"
    });
  }

}


async function checkUsernameFree(req, res, next) {
  try {
    const usernameexist = await findBy({ username: req.body.username })
    if (usernameexist[0]) {
      next({ status: 422, message: 'Username taken' })
    } else {
      next()
    }
  } catch (error) {
    next()
  }

}

async function checkUsernameExists(req, res, next) {
  try {
    const { username } = req.body
    const usernameexist = await findBy({ username: username })
    if (usernameexist[0]) {
      req.user = usernameexist[0]
      next()
    } else {
      next({
        status: 401,
        message: "Invalid credentials"
      })
    }
  } catch (error) {
    next()
  }
}

async function checkPasswordLength(req, res, next) {
  try {
    const password = req.body.password
    if (!password || password.length < 3) {
      next({ status: 422, message: "Password must be longer than 3 chars" })
    } else {
      next()
    }

  } catch (error) {
    next(error)
  }
}


module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}