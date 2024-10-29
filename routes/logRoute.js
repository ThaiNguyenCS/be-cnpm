const { Router } = require("express");
const logController = require("../controllers/logController");
const router = Router();

router.post("/", logController.createLog);
router.get("/:studentID", logController.getLog);
router.put("/:studentID", logController.updateLog);

// Add more routes as needed

module.exports = router;
