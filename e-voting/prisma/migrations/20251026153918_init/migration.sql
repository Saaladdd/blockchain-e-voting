/*
  Warnings:

  - You are about to drop the `Election` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Party` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `dob` on the `Voter` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Voter` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `Voter` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Voter` table. All the data in the column will be lost.
  - You are about to drop the column `voter_id` on the `Voter` table. All the data in the column will be lost.
  - Added the required column `idHash` to the `Voter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voterId` to the `Voter` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Election_name_key";

-- DropIndex
DROP INDEX "Party_name_key";

-- DropIndex
DROP INDEX "Vote_voterId_electionId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Election";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Party";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Vote";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Candidate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "VoteRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "candidateId" INTEGER NOT NULL,
    "txHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Voter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "voterId" INTEGER NOT NULL,
    "idHash" TEXT NOT NULL
);
INSERT INTO "new_Voter" ("id") SELECT "id" FROM "Voter";
DROP TABLE "Voter";
ALTER TABLE "new_Voter" RENAME TO "Voter";
CREATE UNIQUE INDEX "Voter_idHash_key" ON "Voter"("idHash");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_name_key" ON "Candidate"("name");
