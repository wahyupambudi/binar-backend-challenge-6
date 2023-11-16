const router = require("express").Router();

const {Insert, PictureUpdate} = require("../controller/article.controller");
// const { CheckPostUser } = require('../middleware/middleware')

const storage = require("../lib/multer");
const multer = require("multer")();

router.post("/", Insert);
router.put("/:id", multer.single("url_img"), PictureUpdate);

// router.post("/login", Login);
// router.get("/whoami", Authenticate, whoami);
// router.get("/", Authenticate, Get);
// router.put(
//   "/:email",
//   Authenticate,
//   restrictUser,
//   storage.Image.single("profilePicture"),
//   PictureUpdate,
// );
// router.post("/image-single", storage.Image.single("images"), MediaProcessingImage);

module.exports = router;
