/*
  Warnings:

  - Added the required column `name` to the `Voter` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Voter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "idHash" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "otp" INTEGER
);
INSERT INTO "new_Voter" ("id", "idHash", "otp", "phoneNumber") SELECT "id", "idHash", "otp", "phoneNumber" FROM "Voter";
DROP TABLE "Voter";
ALTER TABLE "new_Voter" RENAME TO "Voter";
CREATE UNIQUE INDEX "Voter_idHash_key" ON "Voter"("idHash");
CREATE UNIQUE INDEX "Voter_phoneNumber_key" ON "Voter"("phoneNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
