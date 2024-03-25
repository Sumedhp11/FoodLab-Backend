import express from "express";
import {
  changeDeliveryStatus,
  deleteUser,
  getAllOrders,
  getAllUsers,
} from "../controllers/admin-controller.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/deleteuser", deleteUser);
router.get("/orders", getAllOrders);
router.put("/update-delivery-status", changeDeliveryStatus);

export default router;
