import express from "express";
import {
  EditRestaurant,
  changeDeliveryStatus,
  deleteRes,
  deleteUser,
  getAllOrders,
  getAllUsers,
} from "../controllers/admin-controller.js";
import upload from "../helper/multerconfig.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/deleteuser", deleteUser);
router.get("/orders", getAllOrders);
router.put("/update-delivery-status", changeDeliveryStatus);
router.post("/edit-res/:id", upload.single("image"), EditRestaurant);
router.put("/delete-res", deleteRes);

export default router;
