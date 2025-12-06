-- CreateTable
CREATE TABLE "RecBook" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "authors" TEXT[],
    "categories" TEXT[],
    "averageRating" DOUBLE PRECISION,
    "maturityRating" TEXT,
    "publishedDate" INTEGER,
    "pageCount" INTEGER,

    CONSTRAINT "RecBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecBook_externalId_key" ON "RecBook"("externalId");
