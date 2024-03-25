import express from "express";
import { deleteUser, getAllUsers } from "../controllers/admin-controller.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/deleteuser", deleteUser);

export default router;
