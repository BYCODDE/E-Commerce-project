import { db } from "@/db";
import { refreshTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function logout(refreshToken: string) {
  if (!refreshToken) return;

  try {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
  } catch (error) {
    console.warn("Logout failed to delete token DB (Maybe already gone)");
  }
}
