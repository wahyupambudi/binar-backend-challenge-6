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
      { data: article, dataImageKit: uploadFile },
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

async function getDetailImg(req, res) {
  const fileName = "6555e30c88c257da330122bb";
  try {
    const filesList = await imagekit.getFileDetails(fileName);

    if (filesList.length > 0) {
      const firstFile = filesList[0];

      // Dapatkan fileId dari respons
      const fileId = firstFile.fileId;

      console.log("File ID:", fileId);
    } else {
      console.log("File not found.");
    }

    res.status(200).json({
      data: filesList,
      message: "success",
      status: 200,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "internal server error",
      status: 500,
      error: error.message,
    });
  }
}

async function GetAllImg(req, res) {

  const {limitImage} = req.params;

  try {
    const filesList = await imagekit.listFiles({
      limit: limitImage, // Ambil jumlah file
    });

    if (filesList.length < 0) {
      console.log("File not found.");
    }

    res.status(200).json({
      data: filesList,
      message: "success",
      status: 200,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "internal server error",
      status: 500,
      error: error.message,
    });
  }
}

module.exports = {
  Insert,
  PictureUpdate,
  getDetailImg,
  GetAllImg
};
