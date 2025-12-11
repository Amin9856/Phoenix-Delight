const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth(), ordersController.placeOrder);
router.get("/my", auth(), ordersController.myOrders);

// admin
router.get("/today", auth("admin"), ordersController.todayOrders);
router.put("/:id/status", auth("admin"), ordersController.updateStatus);

module.exports = router;
