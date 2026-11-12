-- CreateTable
CREATE TABLE "Test" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "firma" BOOLEAN NOT NULL DEFAULT false,
    "fecha" DATE NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "grupos" TEXT NOT NULL,
    "given_name" TEXT DEFAULT 'Nombre',
    "avatar" TEXT NOT NULL DEFAULT 'noavatar.png',
    "nickname" TEXT NOT NULL DEFAULT 'Sin alias',
    "familiafp" TEXT DEFAULT 'Sin familia',
    "ciclofp" TEXT DEFAULT 'Sin ciclo',
    "curso" TEXT DEFAULT 'Sin curso',
    "finPerfil" BOOLEAN NOT NULL DEFAULT false,
    "pretest" BOOLEAN NOT NULL DEFAULT false,
    "posttest" BOOLEAN NOT NULL DEFAULT false,
    "token_pretest" TEXT NOT NULL DEFAULT '',
    "token_posttest" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "maxpoints" INTEGER NOT NULL DEFAULT 20,
    "token" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscapareteSession" (
    "id" UUID NOT NULL,
    "equipo" TEXT NOT NULL,
    "casoId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagenPath" TEXT NOT NULL,
    "evaluaJSON" JSONB,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EscapareteSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemRubrica" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "nivel" TEXT NOT NULL,
    "justification" TEXT NOT NULL,
    "escaparametroSessionId" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemRubrica_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Test_name_key" ON "Test"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Actividad_token_key" ON "Actividad"("token");

-- CreateIndex
CREATE INDEX "ItemRubrica_escaparametroSessionId_idx" ON "ItemRubrica"("escaparametroSessionId");

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRubrica" ADD CONSTRAINT "ItemRubrica_escaparametroSessionId_fkey" FOREIGN KEY ("escaparametroSessionId") REFERENCES "EscapareteSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
