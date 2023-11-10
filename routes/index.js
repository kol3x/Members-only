const express = require("express");
const router = express.Router();
const passport = require('passport');
const message_controller = require("../controllers/messageController");

router.get("/", message_controller.display_messages_get);

router.post("/", message_controller.delete_message);

module.exports = router;
