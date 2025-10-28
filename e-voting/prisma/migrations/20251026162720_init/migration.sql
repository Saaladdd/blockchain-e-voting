/*
  Warnings:

  - You are about to drop the column `voterId` on the `Voter` table. All the data in the column will be lost.
  - Added the required column `phoneNumber` to the `Voter` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Voter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idHash" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "otp" INTEGER
);
INSERT INTO "new_Voter" ("id", "idHash") SELECT "id", "idHash" FROM "Voter";
DROP TABLE "Voter";
ALTER TABLE "new_Voter" RENAME TO "Voter";
CREATE UNIQUE INDEX "Voter_idHash_key" ON "Voter"("idHash");
CREATE UNIQUE INDEX "Voter_phoneNumber_key" ON "Voter"("phoneNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
