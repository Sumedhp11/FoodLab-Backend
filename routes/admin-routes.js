import express from "express";
import {
  EditRestaurant,
  changeDeliveryStatus,
  deleteRes,
  deleteUser,
  getAllOrders,
  getAllUsers,
  addnewres,
  GetAllOrderChartData,
  getNumberOfDeliveryStatusOrders,
  getNumberOfUserPerMonth,
  getAllrestaurants,
} from "../controllers/admin-controller.js";
import upload from "../helper/multerconfig.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/deleteuser", deleteUser);
router.get("/orders", getAllOrders);
router.get("/order-monthly", GetAllOrderChartData);
router.get("/user-monthly", getNumberOfUserPerMonth);
router.get("/delivery-status-no", getNumberOfDeliveryStatusOrders);
router.put("/update-delivery-status", changeDeliveryStatus);
router.post("/edit-res/:id", upload.single("image"), EditRestaurant);
router.get("/allrestaurants", getAllrestaurants);
router.post("/edit-res/:id", upload.single("image"), EditRestaurant);
router.put("/delete-res", deleteRes);
router.post("/add-res", upload.single("image"), addnewres);

export default router;
