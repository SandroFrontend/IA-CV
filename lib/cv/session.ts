import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "cv_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function sessionSecret() {
  const secret = process.env.CV_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("Configura CV_SESSION_SECRET con al menos 32 caracteres.");
  }
  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export async function createCVSession(applicantId: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = `${applicantId}.${expiresAt}`;
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function deleteCVSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCVSessionApplicantId() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  const [applicantId, expiresAt, signature, extra] = token.split(".");
  if (
    !applicantId ||
    !expiresAt ||
    !signature ||
    extra !== undefined ||
    !/^\d+$/.test(expiresAt) ||
    Number(expiresAt) <= Math.floor(Date.now() / 1000)
  ) {
    return null;
  }

  const payload = `${applicantId}.${expiresAt}`;
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return null;
  }

  return applicantId;
}

export async function getCurrentCVApplicant() {
  const applicantId = await getCVSessionApplicantId();
  if (!applicantId) return null;

  return prisma.cVApplicant.findUnique({
    where: { id: applicantId },
    select: {
      id: true,
      username: true,
      fullName: true,
      sector: true,
      cvFilename: true,
      cvUploadedAt: true,
    },
  });
}
