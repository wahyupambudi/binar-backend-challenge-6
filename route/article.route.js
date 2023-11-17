const router = require("express").Router();

const {GetArticle, ArticleUpdate, GetAllImg, DeleteArticle, GetDetailImg, InsertArticle, PictureUpdate} = require("../controller/article.controller");
// const { CheckPostUser } = require('../middleware/middleware')

const storage = require("../lib/multer");
const multer = require("multer")();

router.get("/", GetArticle);
router.post("/", InsertArticle);
router.put("/:id", ArticleUpdate);
router.delete("/:id", DeleteArticle);
router.get("/allImage/:limitImage", GetAllImg);
router.get("/detailImg", GetDetailImg);
router.put("/picture/:id", multer.single("url_img"), PictureUpdate);

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
