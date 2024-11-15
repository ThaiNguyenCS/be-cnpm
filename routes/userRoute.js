const { Router } = require("express");
const userController = require("../controllers/user.controller");
const { authenticateBearerToken} = require("../middlewares/authenticate.middleware")
const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/forget", userController.forgetPassword)
router.get("/info", authenticateBearerToken , userController.getUser);
// router.put("/:id", userController.updateUser);


module.exports = router;