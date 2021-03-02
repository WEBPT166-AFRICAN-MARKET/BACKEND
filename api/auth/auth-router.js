const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');
const { isValid } = require("../users/users-service.js");

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  const user = req.body;

  const hash = bcrypt.hashSync(user.password, 10);

  user.password = hash;

  Users.add(user)
  .then(newUser => {
    res.status(201).json(newUser);
  })
  .catch(err => {
    res.status(500).json({ message: 'username taken', err});
  })
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!isValid(req.body)) {
      next({ apiCode: 400, apiMessage: 'invalid credentials' })
    } else {
      const [user] = await Users.findBy({ username: username });
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `welcome, ${user.username}`, token })
      } else {
        next({ apiCode: 400, apiMessage: 'invalid credentials' });
      }
    } 
  } catch (err) {
    next({apiCode: 500, apiMessage: 'invalid credentials'})
  }
});

router.get('/logout', (req, res) => {
  if (req.session) {
      req.session.destroy(err => {
          if (err) {
              res.status(500).json({ message: "Failed to logout"});
          } else {
              res.status(200).json({ message: "See you later" });
          }
      });
  };
});

function generateToken(user) {

  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1h"
  };

  const token = jwt.sign(payload, secrets.jwtSecret, options);

  return token;

}

module.exports = router;