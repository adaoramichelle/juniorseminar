-- CreateTable
CREATE TABLE "RecBooks" (
    "title" TEXT NOT NULL,
    "author" TEXT,
    "cover" TEXT,
    "description" TEXT,
    "genres" TEXT[],
    "averageRating" DOUBLE PRECISION NOT NULL,
    "ratingsCount" INTEGER NOT NULL,
    "googleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecBooks_pkey" PRIMARY KEY ("googleId")
);
