/*
  Warnings:

  - You are about to drop the column `created_at` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "article" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
