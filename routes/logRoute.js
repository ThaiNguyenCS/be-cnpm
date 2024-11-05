const { Router } = require("express");
const logController = require("../controllers/logController");
const router = Router();

router.post("/", logController.createLog);
router.get("/:studentUserName", logController.getLog);
router.get("/time/:studentUserName", logController.getLogsByTimeStudent);
router.get("/allStudent/time", logController.getLogsByTime);
router.put("/:id", logController.updateLog);

// Add more routes as needed

module.exports = router;
