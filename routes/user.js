const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const userCtrl = require("../controllers/user");
const rateLimit = require("../middleware/limit");

router.post("/signup", userCtrl.signup);
router.post("/login", rateLimit.limiter, userCtrl.login);
router.put("/user/:id", auth, userCtrl.updateProfil);
router.delete("/user/:id", auth, userCtrl.deleteUser);
router.get("/user/:id", auth, userCtrl.getProfile);

module.exports = router;
