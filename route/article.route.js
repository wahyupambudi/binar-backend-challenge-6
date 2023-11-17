const router = require("express").Router();

const {
  GetArticle,
  InsertArticle,
  ArticleUpdate,
  DeleteArticle,
  GetAllImg,
  GetDetailImg,
} = require("../controller/article.controller");
const { CheckPostUser } = require("../middleware/middleware");

const storage = require("../lib/multer");
const multer = require("multer")();

// article
router.get("/", GetArticle);
router.post("/", multer.single("url_img"), CheckPostUser, InsertArticle);
router.put("/:id", multer.single("url_img"), CheckPostUser, ArticleUpdate);
router.delete("/:id", multer.single("url_img"), DeleteArticle);

// imagekit
router.get("/picture/:limitImage", GetAllImg);
router.get("/pict/:id", GetDetailImg);

module.exports = router;
