const express = require("express");
const { createUser, loginUser } = require("../controllers/auth-controller");
const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);

exports.router = router;
