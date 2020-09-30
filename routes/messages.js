const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const messageCtrl = require("../controllers/message");

router.post("/new", auth, multer, messageCtrl.createMessage);
router.get("/all", auth, messageCtrl.getAllMessage);
router.put("/:id", auth, messageCtrl.modifyMessage);
router.delete("/:id", auth, messageCtrl.deleteMessage);
router.post("/:id/like", auth, messageCtrl.likeOrNot);

module.exports = router;
