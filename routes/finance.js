const express = require("express");
const router = express.Router();
const financeController = require("../controllers/financeController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth("admin"), financeController.addDailyExpense);
router.get("/daily", auth("admin"), financeController.dailySummary);
router.get("/monthly", auth("admin"), financeController.monthlySummary);

module.exports = router;
