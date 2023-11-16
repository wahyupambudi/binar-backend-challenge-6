const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../lib/imagekit");

require("dotenv").config();

async function Insert(req, res, next) {
  const { title, description, url_img } = req.body;

  try {
    const article = await prisma.article.create({
      data: {
        title,
        description,
        url_img,
      },
    });
    let respons = ResponseTemplate(
      article,
      "article created success",
      null,
      200,
    );
    res.status(200).json(respons);
    return;
  } catch (error) {
    next(error);
  }
}

async function PictureUpdate(req, res) {
  const url_img = req.body;
  const { id } = req.params;
  const payload = {};

  if (!url_img) {
    let resp = ResponseTemplate(null, "bad request", null, 400);
    res.json(resp);
    return;
  }

  // image kit
  const fileString = req.file.buffer.toString("base64");

  const uploadFile = await imagekit.upload({
    fileName: req.file.originalname,
    file: fileString,
  });

  if (url_img) {
    payload.url_img = uploadFile.url;
  }

  try {
    const article = await prisma.article.update({
      where: {
        id: parseInt(id),
      },
      data: payload,
    });

    let resp = ResponseTemplate(
      { data: article },
      "Article Picure has Updated",
      null,
      200,
    );
    res.json(resp);
    return;
  } catch (error) {
    console.log(error);
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.json(resp);
    return;
  }
}

module.exports = {
  Insert,
  PictureUpdate,
};
