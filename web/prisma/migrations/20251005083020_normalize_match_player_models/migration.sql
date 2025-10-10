-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupId" INTEGER,
    "homeId" INTEGER NOT NULL,
    "awayId" INTEGER NOT NULL,
    "kickOff" DATETIME,
    "gHome" INTEGER NOT NULL DEFAULT 0,
    "gAway" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "week" INTEGER,
    CONSTRAINT "Match_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Match_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_awayId_fkey" FOREIGN KEY ("awayId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("awayId", "gAway", "gHome", "groupId", "homeId", "id", "kickOff", "status", "week") SELECT "awayId", coalesce("gAway", 0) AS "gAway", coalesce("gHome", 0) AS "gHome", "groupId", "homeId", "id", "kickOff", "status", "week" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE INDEX "Match_groupId_idx" ON "Match"("groupId");
CREATE INDEX "Match_homeId_idx" ON "Match"("homeId");
CREATE INDEX "Match_awayId_idx" ON "Match"("awayId");
CREATE INDEX "Match_kickOff_idx" ON "Match"("kickOff");
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "dept" TEXT,
    "groupId" INTEGER,
    CONSTRAINT "Player_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("dept", "fullName", "groupId", "id") SELECT "dept", "fullName", "groupId", "id" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE INDEX "Player_groupId_idx" ON "Player"("groupId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
