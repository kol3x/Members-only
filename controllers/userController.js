const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("signup");
});

exports.sign_up_post = [
  body("first_name", "First name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last name should not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password should be >= 4").isLength({ min: 4 }).escape(),
  body("password_check", "Passwords don't match")
    .isLength({ min: 4 })
    .escape()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("signup", {
        errors: errors.array(),
      });
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      try {
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
        });
        await user.save();
        res.redirect("/");
      } catch (err) {
        return next(err);
      }
    });
  }),
];

exports.login_get = asyncHandler(async (req, res, next) => {
  res.render("login");
});

exports.login_post = [
  body("username").trim().isLength({ min: 1 }).escape(),
  body("password").isLength({ min: 4 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("signup", {
        errors: errors.array(),
      });
    }
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  }),
];
