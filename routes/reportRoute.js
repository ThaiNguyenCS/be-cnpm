const {Router} = require("express");
const { getReportHandler, getYearlyStatHandler } = require("../controllers/reportController");


const router = Router();

router.get("/", getReportHandler);
router.get("/stat/:year", getYearlyStatHandler);

module.exports = router