-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "image" TEXT NOT NULL DEFAULT '1',
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "success" INTEGER NOT NULL DEFAULT 0,
    "fail" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "CommandToUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commandId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CommandToUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CommandToUser_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Command" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isLocal" BOOLEAN NOT NULL,
    "adminId" TEXT NOT NULL,
    CONSTRAINT "Command_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "commandId" TEXT NOT NULL,
    CONSTRAINT "Todo_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commandId" TEXT NOT NULL,
    "recepientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "senderId" TEXT,
    "fail" INTEGER,
    "success" INTEGER,
    CONSTRAINT "Notification_recepientId_fkey" FOREIGN KEY ("recepientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
