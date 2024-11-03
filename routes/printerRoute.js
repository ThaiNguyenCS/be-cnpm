// Author: THAI
/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Returns a greeting
 *     responses:
 *       200:
 *         description: A greeting message
 */
const { Router } = require("express");
const router = Router();
const printerController = require("../controllers/printerController")

router.get("/:printerID", printerController.getPrinterHandler);
router.patch("/:printerID", printerController.updatePrinterHandler);
router.get("/", printerController.getAllPrintersHandler); // get all printers
router.post("/", printerController.addPrinterHandler);


module.exports = router;
