const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/userController");

router.get("/", user_controller.sign_up_get);

router.post("/", user_controller.sign_up_post);

module.exports = router;
