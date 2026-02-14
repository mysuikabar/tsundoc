import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDB } from "@/db";

export function getAuth() {
  return betterAuth({
    database: drizzleAdapter(getDB(), { provider: "sqlite" }),
    emailAndPassword: { enabled: true },
  });
}
