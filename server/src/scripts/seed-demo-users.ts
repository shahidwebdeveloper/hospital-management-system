import mongoose from "mongoose";

import type { AppRole } from "@hms/contracts";

import { connectDatabase } from "../config/database.js";
import { auth } from "../lib/auth.js";
import { authDb, client } from "../lib/database.js";
import { User } from "../modules/user/user-model.js";

const demoPassword = process.env.HMS_DEMO_PASSWORD;

if (!demoPassword || demoPassword.length < 8) {
  throw new Error(
    "Set HMS_DEMO_PASSWORD to at least 8 characters before running this seed script."
  );
}

const password: string = demoPassword;

const demoUsers: Array<{ role: AppRole; name: string; email: string }> = [
  { role: "super_admin", name: "Super Admin Demo", email: "superadmin@hms.local" },
  { role: "admin", name: "Admin Demo", email: "admin@hms.local" },
  { role: "doctor", name: "Doctor Demo", email: "doctor@hms.local" },
  { role: "nurse", name: "Nurse Demo", email: "nurse@hms.local" },
  { role: "receptionist", name: "Receptionist Demo", email: "receptionist@hms.local" },
  { role: "lab_technician", name: "Lab Technician Demo", email: "lab@hms.local" },
  { role: "pharmacist", name: "Pharmacist Demo", email: "pharmacist@hms.local" },
  { role: "patient", name: "Patient Demo", email: "patient@hms.local" }
];

type AuthUserDocument = {
  id?: string;
  _id?: { toString(): string };
  email?: string;
};

function getAuthUserId(user: AuthUserDocument | null) {
  if (!user) return null;
  return user.id ?? user._id?.toString() ?? null;
}

async function findAuthUserByEmail(email: string) {
  const collections = ["user", "users"];

  for (const collectionName of collections) {
    const user = await authDb.collection<AuthUserDocument>(collectionName).findOne({ email });
    if (user) return user;
  }

  return null;
}

async function ensureAuthUser(name: string, email: string) {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password
      }
    });

    return result.user.id;
  } catch {
    const existingUser = await findAuthUserByEmail(email);
    const existingUserId = getAuthUserId(existingUser);

    if (!existingUserId) {
      throw new Error(`Could not find or create Better Auth user for ${email}`);
    }

    return existingUserId;
  }
}

async function seedDemoUsers() {
  await connectDatabase();
  await client.connect();

  for (const demoUser of demoUsers) {
    const authUserId = await ensureAuthUser(demoUser.name, demoUser.email);

    await User.findOneAndUpdate(
      { email: demoUser.email },
      {
        authUserId,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        isActive: true,
        isVerified: true
      },
      { upsert: true, new: true, runValidators: true }
    );

    console.log(`${demoUser.role.padEnd(14)} ${demoUser.email}`);
  }
}

seedDemoUsers()
  .then(async () => {
    await mongoose.disconnect();
    await client.close();
    console.log("Demo role users are ready.");
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await mongoose.disconnect();
    await client.close();
    process.exit(1);
  });


