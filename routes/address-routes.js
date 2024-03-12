import express from "express";
import { addNewAddress } from "../controllers/address-controller.js";

const router = express.Router();

router.post("/addnewaddress", addNewAddress);

export default router;
