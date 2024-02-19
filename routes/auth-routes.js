const express = require("express");
const { createUser, loginUser } = require("../controllers/auth-controller");
const router = express.Router();

router.get("/signup", createUser);
router.get("/login", loginUser);
exports.router = router;
