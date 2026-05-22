-- CreateTable
CREATE TABLE "user_behaviors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "eventType" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "section" TEXT,
    "elementId" TEXT,
    "timeSpent" INTEGER,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "user_behaviors_eventType_idx" ON "user_behaviors"("eventType");

-- CreateIndex
CREATE INDEX "user_behaviors_userId_idx" ON "user_behaviors"("userId");
