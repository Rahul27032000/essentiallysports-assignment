-- CreateEnum
CREATE TYPE "public"."ArticleStatus" AS ENUM ('PUBLISHED', 'REJECTED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."requestType" AS ENUM ('INBOUND', 'OUTBOUND', 'INTERNAL');

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "partnerCode" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "log" JSONB NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "status" "public"."ArticleStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "validationConfig" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RequestLog" (
    "id" SERIAL NOT NULL,
    "requestCode" TEXT NOT NULL,
    "requestType" "public"."requestType" NOT NULL,
    "requestMethod" TEXT NOT NULL,
    "requestUrl" TEXT NOT NULL,
    "requestedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseStatusCode" INTEGER NOT NULL,
    "responseAt" TIMESTAMPTZ(3) NOT NULL,
    "log" JSONB NOT NULL,

    CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id")
);
