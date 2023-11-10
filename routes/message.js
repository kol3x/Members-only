const express = require("express");
const router = express.Router();

const message_controller = require("../controllers/messageController");

router.get("/", message_controller.add_message_get);

router.post("/", message_controller.add_message_post);

module.exports = router;
