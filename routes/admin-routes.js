import express from "express";
import { getAllUsers } from "../controllers/admin-controller.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/deleteuser", getAllUsers);

export default router;
