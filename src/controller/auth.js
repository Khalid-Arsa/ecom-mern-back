const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


exports.signup = (req, res) => {

  User.findOne({
    email: req.body.email
  })
    .exec(async (error, user) => {
      // If email is already registered
      if (user) return res.status(400).json({
        message: 'User already registered'
      });

      // Create User
      const { firstName, lastName, email, password } = req.body;

      const hash_password = await bcrypt.hash(password, 10);

      const _user = new User({
        firstName,
        lastName,
        email,
        hash_password,
        userName: Math.random().toString()
      });

      _user.save((error, user) => {
        if (error) {
          return res.status(400).json({
            message: "Something went wrong",
          });
        }

        if (user) {
          return res.status(201).json({
            user: 'User created successfully',
          });
        }
      });
    });
}

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .exec((error, user) => {
      if (error) {
        return res.status(400).json({
          error
        })
      }
      if (user) {

        // if the password is match
        if (user.authenticate(req.body.password)) {
          const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
          const { _id, firstName, lastName, email, role, fullName } = user
          res.status(200).json({
            token,
            user: {
              _id, firstName, lastName, email, role, fullName
            }
          })
        } else {
          // if password is not match
          return res.status(400).json({
            message: 'Invalid Password'
          })
        }

      } else {
        return res.status(400).json({
          message: "Something went wrong"
        })
      }
    })
}
