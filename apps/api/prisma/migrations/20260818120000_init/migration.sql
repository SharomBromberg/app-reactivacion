-- CreateEnum
CREATE TYPE "Zone" AS ENUM ('ATARDECERES', 'CIUDADELA_DEL_NORTE', 'CUMANDAY', 'ECOTURISTICO_CERRO_DE_ORO', 'ESTACION', 'LA_FUENTE', 'LA_MACARENA', 'PALOGRANDE', 'SAN_JOSE', 'TESORITO', 'UNIVERSITARIA', 'OTRA');

-- CreateEnum
CREATE TYPE "Sector" AS ENUM ('ALIMENTOS_Y_BEBIDAS', 'ABARROTES_Y_TIENDA', 'ROPA_Y_CALZADO', 'BELLEZA_Y_CUIDADO_PERSONAL', 'SALUD', 'EDUCACION', 'TECNOLOGIA', 'CONSTRUCCION_Y_FERRETERIA', 'TRANSPORTE', 'SERVICIOS_PROFESIONALES', 'ARTE_Y_ARTESANIAS', 'AGROPECUARIO', 'OTRO');

-- CreateEnum
CREATE TYPE "DamageLevel" AS ENUM ('SIN_AFECTACION', 'AFECTACION_LEVE', 'AFECTACION_MODERADA', 'LOCAL_INHABITABLE', 'PERDIDA_TOTAL');

-- CreateEnum
CREATE TYPE "SupportPostType" AS ENUM ('BUSCO', 'OFREZCO');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "ModerationTargetType" AS ENUM ('BUSINESS', 'PRODUCT', 'SUPPORT_POST');

-- CreateEnum
CREATE TYPE "ModerationActionType" AS ENUM ('APPROVE', 'REJECT', 'BAN', 'UNBAN', 'SOFT_DELETE', 'RESTORE', 'EDIT_NOTE');

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zone" "Zone" NOT NULL,
    "sector" "Sector" NOT NULL,
    "damageLevel" "DamageLevel" NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT,
    "status" "ModerationStatus" NOT NULL DEFAULT 'APROBADO',
    "deletedAt" TIMESTAMP(3),
    "bannedAt" TIMESTAMP(3),
    "moderationNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ModerationStatus" NOT NULL DEFAULT 'APROBADO',
    "deletedAt" TIMESTAMP(3),
    "bannedAt" TIMESTAMP(3),
    "moderationNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportPost" (
    "id" TEXT NOT NULL,
    "type" "SupportPostType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "zone" "Zone" NOT NULL,
    "sector" "Sector",
    "phone" TEXT NOT NULL,
    "businessId" TEXT,
    "status" "ModerationStatus" NOT NULL DEFAULT 'APROBADO',
    "deletedAt" TIMESTAMP(3),
    "bannedAt" TIMESTAMP(3),
    "moderationNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationAction" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "targetType" "ModerationTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "action" "ModerationActionType" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Business_zone_idx" ON "Business"("zone");

-- CreateIndex
CREATE INDEX "Business_sector_idx" ON "Business"("sector");

-- CreateIndex
CREATE INDEX "Business_status_idx" ON "Business"("status");

-- CreateIndex
CREATE INDEX "Product_businessId_idx" ON "Product"("businessId");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE INDEX "SupportPost_zone_idx" ON "SupportPost"("zone");

-- CreateIndex
CREATE INDEX "SupportPost_sector_idx" ON "SupportPost"("sector");

-- CreateIndex
CREATE INDEX "SupportPost_type_idx" ON "SupportPost"("type");

-- CreateIndex
CREATE INDEX "SupportPost_status_idx" ON "SupportPost"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "ModerationAction_targetType_targetId_idx" ON "ModerationAction"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "ModerationAction_adminId_idx" ON "ModerationAction"("adminId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportPost" ADD CONSTRAINT "SupportPost_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationAction" ADD CONSTRAINT "ModerationAction_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
