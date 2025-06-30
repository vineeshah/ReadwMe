-- AlterTable
ALTER TABLE "User" ADD COLUMN     "spotifyRefreshToken" TEXT,
ADD COLUMN     "spotifyToken" TEXT,
ADD COLUMN     "spotifyTokenExpiry" TIMESTAMP(3);
