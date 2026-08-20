-- CreateEnum
CREATE TYPE "BusinessSource" AS ENUM ('PUBLIC', 'SEED');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "source" "BusinessSource" NOT NULL DEFAULT 'PUBLIC';
