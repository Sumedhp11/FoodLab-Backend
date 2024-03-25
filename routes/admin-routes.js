import express from "express";
import {
  deleteUser,
  getAllOrders,
  getAllUsers,
} from "../controllers/admin-controller.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/deleteuser", deleteUser);
router.get("/orders", getAllOrders);

export default router;
