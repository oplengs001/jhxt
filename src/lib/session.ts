import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET || "fallback-secret-key-32-chars-minimum-manila";
const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "SALES";
  expiresAt: Date;
}

export async function encrypt(payload: Omit<SessionPayload, "expiresAt">) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return new SignJWT({ ...payload, expiresAt: expiresAt.toISOString() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return {
      userId: payload.userId as string,
      name: payload.name as string,
      email: payload.email as string,
      role: (payload.role as "ADMIN" | "SALES") || "SALES",
      expiresAt: new Date(payload.expiresAt as string),
    };
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string, name: string, email: string, role: "ADMIN" | "SALES") {
  const token = await encrypt({ userId, name, email, role });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return token;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  return await decrypt(sessionToken);
}
