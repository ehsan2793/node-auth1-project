
const { add, findBy } = require('../users/users-model');
const bcrypt = require('bcryptjs')
const router = require('express').Router();
const { checkPasswordLength, checkUsernameFree, checkUsernameExists } = require('./auth-middleware')

router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 4)

    req.body.password = hash
    const newUser = await add(req.body)
    res.status(200).json(newUser);

  } catch (error) {
    next(error);
  }
});

router.post('/login', checkUsernameExists, async (req, res, next) => {
  try {
    const [existingUser] = await findBy({ username: req.body.username })
    const userCanlogin = bcrypt.compareSync(req.body.password, existingUser.password)
    if (userCanlogin) {
      req.session.user = req.user
      res.status(200).json({ message: `Welcome ${req.body.username}!` });
    } else {
      next({ status: 401, message: 'Invalid credentials' })
    }


  } catch (error) {
    next(error);
  }
});

router.get('/logout', (req, res, next) => {
  console.log(req.session.user)
  try {
    if (req.session.user) {
      req.session.destroy(err => {
        if (err) {
          next(err)
        } else {

          res.status(200).json({ message: "logged out" })
        }
      })
    }
    else {
      res.status(200).json({ message: 'no session' })
    }
  } catch (error) {
    next(error);
  }

});

module.exports = router;