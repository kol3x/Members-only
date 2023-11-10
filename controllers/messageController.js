const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const User = require("../models/user");
const Message = require("../models/message");

exports.add_message_get = asyncHandler(async (req, res, next) => {
  res.render("message-form", {
    userid: req.user._id,
  });
});

exports.add_message_post = [
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("message", "Message must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("message-form", {
        user: req.user,
        errors: errors.array(),
        title: req.body.title,
        message: req.body.message,
      });
    }

    const message = new Message({
      title: req.body.title,
      text: req.body.message,
      owner: req.body.owner,
    });
    message.save();
    res.redirect("/");
  }),
];

exports.display_messages_get = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().populate("owner").exec();
  if (req.isAuthenticated()) {
    res.render("index", {
      user: req.user,
      messages: messages,
    });
  } else {
    res.render("index", {
      messages: messages,
    });
  }
});

exports.activation_get = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render("activation-page");
  } else {
    res.render("login");
  }
});

exports.activation_post = [
  body("code", "Wrong code format")
    .trim()
    .isLength({ min: 1, max: 100 })
    .custom((value, { req }) => {
      if (value !== "Secret123") {
        throw new Error("Invalid code");
      }
      return true;
    })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("activation-page", {
        code: req.body.code,
        errors: errors.array(),
      });
    }
    await User.findByIdAndUpdate(req.user, { isMember: true }, {});
    res.redirect("/");
  }),
];

exports.delete_message = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndDelete(req.body.messageid);
  res.redirect("/");
});
