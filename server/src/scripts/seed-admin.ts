import mongoose from "mongoose";

import { connectDatabase } from "../config/database.js";
import { auth } from "../lib/auth.js";
import { authDb, client } from "../lib/database.js";
import { User } from "../modules/user/user-model.js";

const name = process.env.HMS_ADMIN_NAME?.trim();
const email = process.env.HMS_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.HMS_ADMIN_PASSWORD;
const invalidPasswords = new Set(["password", "password123", "change-me", "your-password"]);

if (!name || !email || !password || password.length < 14 || invalidPasswords.has(password.toLowerCase())) {
  throw new Error("Set HMS_ADMIN_NAME, HMS_ADMIN_EMAIL, and a unique HMS_ADMIN_PASSWORD of at least 14 characters.");
}

const adminName: string = name;
const adminEmail: string = email;
const adminPassword: string = password;

type AuthUserDocument = { id?: string; _id?: { toString(): string }; email?: string };

async function existingAuthUserId() {
  for (const collectionName of ["user", "users"]) {
    const user = await authDb.collection<AuthUserDocument>(collectionName).findOne({ email: adminEmail });
    const id = user?.id ?? user?._id?.toString();
    if (id) return id;
  }
  return null;
}

async function seedAdmin() {
  await connectDatabase();
  await client.connect();
  let authUserId = await existingAuthUserId();
  if (!authUserId) {
    const result = await auth.api.signUpEmail({ body: { name: adminName, email: adminEmail, password: adminPassword } });
    authUserId = result.user.id;
  }

  const existing = await User.findOne({ email: adminEmail });
  if (existing && existing.role !== "super_admin") {
    throw new Error("Refusing to promote an existing non-super-admin account. Review this account manually.");
  }

  await User.findOneAndUpdate(
    { email: adminEmail },
    { authUserId, name: adminName, email: adminEmail, role: "super_admin", isActive: true, isVerified: true },
    { upsert: true, new: true, runValidators: true }
  );
  console.log(`Super admin ready: ${adminEmail}`);
}

seedAdmin()
  .then(async () => { await mongoose.disconnect(); await client.close(); })
  .catch(async (error: unknown) => { console.error(error); await mongoose.disconnect(); await client.close(); process.exit(1); });
