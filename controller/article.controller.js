const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../lib/imagekit");

require("dotenv").config();

async function GetArticle(req, res) {
  const { id, title, description, url_img } = req.query;

  const payload = {};

  if (title) {
    payload.title = title;
  }

  if (description) {
    payload.description = description;
  }

  if (url_img) {
    payload.url_img = url_img;
  }

  try {
    const page = parseInt(req.query.page) || 1; // total halaman
    const perPage = parseInt(req.query.perPage) || 10; // total item per halaman
    const skip = (page - 1) * perPage;
    const articles = await prisma.article.findMany({
      skip,
      take: perPage,
      where: {
        title: payload.title,
        description: payload.description,
        url_img: payload.url_img,
        deletedAt: null
      } ,
      select: {
        id: true,
        title: true,
        description: true,
        url_img: true,
      },
    });

    let resp = ResponseTemplate(articles, "success", null, 200);
    res.json(resp);
    return;
  } catch (error) {
    console.log(error)
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.json(resp);
    return;
  }
}

async function InsertArticle(req, res, next) {
  const { title, description, url_img, name_img } = req.body;

  const fileString = req.file.buffer.toString("base64");

  const uploadFile = await imagekit.upload({
    fileName: req.file.originalname,
    file: fileString,
  });

  try {
    const article = await prisma.article.create({
      data: {
        title,
        description,
        url_img: uploadFile.url,
        name_img: uploadFile.name,
      },
    });
    let respons = ResponseTemplate(article, "success", null, 200);
    res.status(200).json(respons);
    return;
  } catch (error) {
    next(error);
  }
}

async function ArticleUpdate(req, res) {
  const { title, description } = req.body;
  const url_img = req.body;
  const name_img = req.body;
  const updatedAt = new Date();
  const { id } = req.params;

  const payload = {};

  if (!title && !description && !url_img) {
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

  if (title) {
    payload.title = title;
  }

  if (description) {
    payload.description = description;
  }

  if (url_img) {
    payload.url_img = uploadFile.url;
  }

  if (name_img) {
    payload.name_img = uploadFile.name;
  }

  if (updatedAt) {
    payload.updatedAt = updatedAt;
  }

  const articles = await prisma.article.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      name_img: true,
    },
  });

    if (articles === null || isNaN(id) ) {
    let resp = ResponseTemplate(null, "Articles is Not Found", null, 404);
    res.json(resp);
    return;
  }

  // mencari nama image dari database
  const fileName = articles.name_img;
  console.log(fileName);

  const filesLists = await imagekit.listFiles({
    searchQuery: `name=${fileName}`,
    limit: 1, // Ambil jumlah file
  });

  // mendapatkan id imagekit
  const getIdImg = filesLists[0].fileId;
  console.log(getIdImg);

  // delete image
  const filesList = await imagekit.deleteFile(getIdImg);

  try {
    const articles = await prisma.article.update({
      where: {
        id: Number(id),
      },
      data: payload,
    });

    let resp = ResponseTemplate(articles, "success", null, 200);
    res.json(resp);
    return;
  } catch (error) {
    console.log(error);
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.json(resp);
    return;
  }
}

async function DeleteArticle(req, res) {
  const deletedAt = req.body;
  const { id } = req.params;

  const payload = {};

  if (deletedAt) {
    payload.deletedAt = deletedAt;
  }

  const articles = await prisma.article.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (articles === null || articles.deletedAt !== null || isNaN(id)) {
    let resp = ResponseTemplate(null, "Articles is Not Found", null, 404);
    res.json(resp);
    return;
  }

  // mencari nama image dari database
  const fileName = articles.name_img;

  const filesLists = await imagekit.listFiles({
    searchQuery: `name=${fileName}`,
    limit: 1, // Ambil jumlah file
  });

  // mendapatkan filepath imagekit
  const getFilePath = filesLists[0].filePath;



  try {
      // move image
  const filesList = await imagekit.moveFile({
    sourceFilePath: getFilePath,
    destinationPath: "soft-delete"
  });
    const articles = await prisma.article.update({
      where: {
        id: Number(id),
      }, 
      data: {
        deletedAt: new Date()
      },
    });
    let resp = ResponseTemplate(articles, "success", null, 200);
    res.json(resp);
    return;
  } catch (error) {
    console.log(error);
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.json(resp);
    return;
  }
}

async function GetAllImg(req, res) {
  const { limitImage } = req.params;

  try {
    const filesList = await imagekit.listFiles({
      limit: limitImage, // Ambil jumlah file
    });

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

async function GetDetailImg(req, res) {
  const { id } = req.params;

  const articles = await prisma.article.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (articles === null || articles.deletedAt !== null || isNaN(id)) {
    let resp = ResponseTemplate(null, "Articles is Not Found", null, 404);
    res.json(resp);
    return;
  }

  // mencari nama image dari database
  const fileName = articles.name_img;

  const filesLists = await imagekit.listFiles({
    searchQuery: `name=${fileName}`,
    limit: 1, // Ambil jumlah file
  });

  // mendapatkan id imagekit
  const getIdImg = filesLists[0].fileId;

  try {
    const filesList = await imagekit.getFileDetails(getIdImg);

    res.status(200).json({
      data: filesList,
      message: "success",
      status: 200,
      error: null,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      data: null,
      message: "internal server error",
      status: 500,
      error: error.message,
    });
  }
}

module.exports = {
  GetArticle,
  InsertArticle,
  ArticleUpdate,
  DeleteArticle,
  GetDetailImg,
  GetAllImg,
};
