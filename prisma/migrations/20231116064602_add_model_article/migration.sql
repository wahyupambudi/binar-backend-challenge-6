-- CreateTable
CREATE TABLE "article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url_img" TEXT NOT NULL,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);
