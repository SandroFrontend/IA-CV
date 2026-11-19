"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/cv/password";
import {
  createCVAdminSession,
  createCVSession,
  deleteCVAdminSession,
  deleteCVSession,
} from "@/lib/cv/session";

export type LoginState = { error?: string };

export async function loginCVApplicant(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const usernameValue = formData.get("username");
  const passwordValue = formData.get("password");
  const username =
    typeof usernameValue === "string" ? usernameValue.trim().toLowerCase() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!/^[a-z0-9._-]{3,32}$/.test(username) || password.length < 1 || password.length > 128) {
    return { error: "El usuario o la contraseña no son válidos." };
  }

  const adminUsername = process.env.CV_ADMIN_USERNAME?.trim() || "admin";
  const adminPassword = process.env.CV_ADMIN_PASSWORD || "admin";
  if (username === adminUsername.toLowerCase() && password === adminPassword) {
    await createCVAdminSession();
    redirect("/ia/admin");
  }

  try {
    const applicant = await prisma.cVApplicant.findUnique({
      where: { username },
      select: { id: true, passwordHash: true },
    });
    if (!applicant || !(await verifyPassword(password, applicant.passwordHash))) {
      return { error: "Usuario o contraseña incorrectos." };
    }

    await createCVSession(applicant.id);
  } catch (error) {
    console.error("Error al iniciar sesión de CV:", error);
    return {
      error: "No se pudo iniciar sesión. Contacta con el centro si el problema continúa.",
    };
  }

  redirect("/ia");
}

export async function logoutCVApplicant() {
  await deleteCVSession();
  redirect("/ia");
}

export async function logoutCVAdmin() {
  await deleteCVAdminSession();
  redirect("/ia");
}
