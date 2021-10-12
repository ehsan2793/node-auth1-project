const User = require('../users/users-model');
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  console.log('restricted');
  next();
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try {
    const { username } = req.body;
    const [foundUser] = await User.findBy({ username: username });

    if (!foundUser) {
      next();
    } else {
      next({ status: 422, message: 'Username taken' });
    }
  } catch (error) {
    next(error);
  }
  next();
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try {

    const { username } = req.body;
    const [foundUser] = await User.findBy({ username: username });
    if (foundUser) {
      next();
    } else {
      next({ status: 401, message: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {

  try {

    const { password } = req.body;
    if (password.length <= 3 || !password) {
      next({ status: 422, message: 'Password must be longer than 3 chars' });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};

// Don't forget to add these to the `exports` object so they can be required in other modules
