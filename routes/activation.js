const express = require("express");
const router = express.Router();
const passport = require('passport');
const message_controller = require("../controllers/messageController");

router.get("/", message_controller.activation_get);

router.post("/", message_controller.activation_post);

module.exports = router;