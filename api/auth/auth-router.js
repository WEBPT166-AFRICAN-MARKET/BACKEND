const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');
const { isValid } = require("../users/users-model.js");

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  const user = req.body;

  if(Users.isValid(user)) {
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    
    Users.add(user)
    .then(newUser => {
      const token = generateToken(newUser)
      res.status(201).json({
        newUser: newUser,
        token: token,
        message: 'Successful Registeration'
      });
    })
    .catch(err => res.status(500).json({message: err.message}))
  } else {
    res.status(400).json({message: 'username and password are required'})
  }
})

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if(Users.isValid(req.body)) {
    Users.findBy({username})
    .then(([ user ]) => {
      if(user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message:  `Welcome, ${user.username}`, token: token})
      } else {
        res.status(401).json({ message: 'Please enter the correct username and password' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    })
  } else {
    res.status(400).json({ message: 'Please provide a username and password' })
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