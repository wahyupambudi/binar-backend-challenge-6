const router = require("express").Router();

const {
  GetArticle,
  ArticleUpdate,
  GetAllImg,
  DeleteArticle,
  GetDetailImg,
  InsertArticle,
  PictureUpdate,
  DeleteImage,
} = require("../controller/article.controller");
// const { CheckPostUser } = require('../middleware/middleware')

const storage = require("../lib/multer");
const multer = require("multer")();

// article
router.get("/", GetArticle);
router.post("/", InsertArticle);
router.put("/:id", ArticleUpdate);
router.delete("/:id", DeleteArticle);

// imagekit
router.get("/picture/:limitImage", GetAllImg);
router.get("/pict/:id", GetDetailImg);
router.put("/picture/:id", multer.single("url_img"), PictureUpdate);
router.delete("/picture/:id", DeleteImage);

module.exports = router;
