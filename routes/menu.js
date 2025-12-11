const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const auth = require("../middleware/authMiddleware");

// public
router.get("/", menuController.getMenu);

// admin
router.post("/", auth("admin"), menuController.addItem);
router.put("/:id", auth("admin"), menuController.updateItem);
router.delete("/:id", auth("admin"), menuController.deleteItem);

module.exports = router;
