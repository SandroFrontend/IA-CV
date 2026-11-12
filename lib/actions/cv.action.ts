"use server";

import { Prisma } from "@/generated/prisma/client";
import { CV_FIXED_SECTORS } from "@/lib/cv/sectors";
import { hashPassword } from "@/lib/cv/password";
import { getCVSessionApplicantId } from "@/lib/cv/session";
import { prisma } from "@/lib/prisma";

const MAX_CV_SIZE = 10 * 1024 * 1024;
const SECTORES = new Set<string>(CV_FIXED_SECTORS);

type RegistrationState = {
  error?: string;
  success?: boolean;
  applicantId?: string;
};

type UploadState = {
  error?: string;
  success?: boolean;
  cvName?: string;
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function uploadDeadline() {
  const configuredDeadline = process.env.CV_UPLOAD_DEADLINE?.trim();
  if (!configuredDeadline) return { closed: false as const };

  const deadline = new Date(configuredDeadline);
  if (!Number.isFinite(deadline.getTime())) {
    return { closed: true as const, invalid: true as const };
  }
  return {
    closed: Date.now() > deadline.getTime(),
    invalid: false as const,
  };
}

function getCVFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) {
    return { error: "Adjunta el currículum en formato PDF." };
  }
  if (value.size > MAX_CV_SIZE) {
    return { error: "El PDF no puede superar los 10 MB." };
  }
  if (!value.name.toLowerCase().endsWith(".pdf")) {
    return { error: "El currículum debe tener extensión .pdf." };
  }
  if (value.type && value.type !== "application/pdf") {
    return { error: "El tipo de archivo debe ser PDF." };
  }
  return { file: value };
}

export async function registerCVApplicant(
  _previousState: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const username = getText(formData, "username").toLowerCase();
  const fullName = getText(formData, "candidato");
  const email = getText(formData, "email");
  const password = formData.get("password");
  const selectedSector = getText(formData, "sector");
  const otherSector = getText(formData, "otroSector");
  const sector = selectedSector === "Otros" ? otherSector : selectedSector;
  const cvResult = getCVFile(formData.get("cv"));

  if ("error" in cvResult) return { error: cvResult.error };
  const deadline = uploadDeadline();
  if (deadline.invalid) {
    return { error: "La fecha límite de subida está mal configurada. Contacta con el centro." };
  }
  if (deadline.closed) {
    return { error: "El plazo para subir currículums ha finalizado." };
  }

  if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
    return {
      error: "El usuario debe tener entre 3 y 32 caracteres: letras, números, punto, guion o guion bajo.",
    };
  }

  if (fullName.length < 2 || fullName.length > 100) {
    return { error: "El nombre debe tener entre 2 y 100 caracteres." };
  }

  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return { error: "Introduce un correo electrónico válido." };
  }

  if (
    typeof password !== "string" ||
    password.length < 12 ||
    password.length > 128
  ) {
    return { error: "La contraseña debe tener entre 12 y 128 caracteres." };
  }

  if (
    selectedSector !== "Otros" &&
    !SECTORES.has(selectedSector)
  ) {
    return { error: "Selecciona un sector profesional válido." };
  }

  if (!sector || sector.length > 100) {
    return { error: "Especifica un sector profesional válido." };
  }

  const cv = cvResult.file;
  const cvData = Buffer.from(await cv.arrayBuffer());
  if (cvData.subarray(0, 5).toString("ascii") !== "%PDF-") {
    return { error: "El archivo adjunto no parece ser un PDF válido." };
  }

  try {
    const passwordHash = await hashPassword(password);
    const applicant = await prisma.cVApplicant.create({
      data: {
        username,
        fullName,
        email: email || null,
        passwordHash,
        sector,
        cvFilename: cv.name.slice(0, 255),
        cvData,
      },
      select: { id: true },
    });

    return { success: true, applicantId: applicant.id };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "Ese nombre de usuario ya está registrado." };
    }

    console.error("Error al registrar al candidato:", error);
    return { error: "No se pudo guardar el registro. Inténtalo de nuevo más tarde." };
  }
}

export async function updateLatestCV(
  _previousState: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const applicantId = await getCVSessionApplicantId();
  if (!applicantId) return { error: "Inicia sesión para actualizar tu currículum." };

  const deadline = uploadDeadline();
  if (deadline.invalid) {
    return { error: "La fecha límite de subida está mal configurada. Contacta con el centro." };
  }
  if (deadline.closed) {
    return { error: "El plazo para subir currículums ha finalizado." };
  }

  const cvResult = getCVFile(formData.get("cv"));
  if ("error" in cvResult) return { error: cvResult.error };

  const cv = cvResult.file;
  const cvData = Buffer.from(await cv.arrayBuffer());
  if (cvData.subarray(0, 5).toString("ascii") !== "%PDF-") {
    return { error: "El archivo adjunto no parece ser un PDF válido." };
  }

  try {
    await prisma.cVApplicant.update({
      where: { id: applicantId },
      data: {
        cvFilename: cv.name.slice(0, 255),
        cvData,
        cvUploadedAt: new Date(),
      },
    });
    return { success: true, cvName: cv.name };
  } catch (error) {
    console.error("Error al actualizar el currículum:", error);
    return { error: "No se pudo actualizar el currículum. Inténtalo de nuevo más tarde." };
  }
}
