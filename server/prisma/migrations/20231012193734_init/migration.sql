-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "RoleCode" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PUBLIC', 'PRIVATE', 'DRAFT');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('SIGNIN', 'SIGNUP');

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "code" "RoleCode" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PUBLIC',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keystore" (
    "id" TEXT NOT NULL,
    "primaryKey" TEXT NOT NULL,
    "secondaryKey" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "clientId" TEXT,

    CONSTRAINT "Keystore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tokenstore" (
    "id" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "token" TEXT NOT NULL,
    "shot_code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "expireAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Tokenstore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "stripe_customerId" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "profile_picture" TEXT,
    "gender" "Gender",
    "profile" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "commisionPercentage" DOUBLE PRECISION,
    "status" "Status" DEFAULT 'PUBLIC',
    "isAccepted" BOOLEAN DEFAULT false,
    "isVerified" BOOLEAN DEFAULT true,
    "isActive" BOOLEAN DEFAULT true,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "roleId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Tokenstore_token_key" ON "Tokenstore"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Tokenstore_shot_code_key" ON "Tokenstore"("shot_code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Keystore" ADD CONSTRAINT "Keystore_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tokenstore" ADD CONSTRAINT "Tokenstore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
