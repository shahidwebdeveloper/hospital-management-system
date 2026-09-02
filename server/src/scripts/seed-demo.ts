import dotenv from "dotenv";
import mongoose from "mongoose";

import { env } from "../config/env.js";
import { auth } from "../lib/auth.js";
import { authDb, client } from "../lib/database.js";
import { DepartmentModel } from "../modules/departments/department-model.js";
import { User } from "../modules/user/user-model.js";

dotenv.config();

const seedUsers = [
  {
    name: "Hospital Administrator",
    email: "admin@hms.local",
    password: "HmsAdminPass!2026Secure",
    role: "super_admin" as const
  },
  {
    name: "Hospital Admin",
    email: "admin-demo@hms.local",
    password: "AdminDemoPass!2026Secure",
    role: "admin" as const
  },
  {
    name: "Dr. Amelia Ross",
    email: "doctor@hms.local",
    password: "DoctorDemoPass!2026Secure",
    role: "doctor" as const
  },
  {
    name: "Nurse Mina Patel",
    email: "nurse@hms.local",
    password: "NurseDemoPass!2026Secure",
    role: "nurse" as const
  },
  {
    name: "Front Desk Jane",
    email: "receptionist@hms.local",
    password: "ReceptionistDemo!2026",
    role: "receptionist" as const
  },
  {
    name: "Lab Tech Victor",
    email: "lab@hms.local",
    password: "LabDemoPass!2026Secure",
    role: "lab_technician" as const
  },
  {
    name: "Pharmacy Lead",
    email: "pharmacist@hms.local",
    password: "PharmacistDemo!2026",
    role: "pharmacist" as const
  },
  {
    name: "Patient Demo",
    email: "patient@hms.local",
    password: "PatientDemoPass!2026",
    role: "patient" as const
  }
];

const departmentSeed = [
  {
    name: "General Medicine",
    code: "GEN",
    description: "Primary care and general consultation",
    location: "Ground Floor"
  },
  {
    name: "Cardiology",
    code: "CARD",
    description: "Heart and vascular care",
    location: "Second Floor"
  },
  {
    name: "Emergency",
    code: "ER",
    description: "Emergency response and urgent care",
    location: "Ground Floor"
  },
  {
    name: "Laboratory",
    code: "LAB",
    description: "Diagnostics and sample processing",
    location: "Lower Basement"
  },
  {
    name: "Pharmacy",
    code: "PHARM",
    description: "Medication dispensing and inventory",
    location: "First Floor"
  },
  {
    name: "Radiology",
    code: "RAD",
    description: "Imaging and diagnostics",
    location: "Second Floor"
  }
];

type AuthUserDocument = {
  id?: string;
  _id?: { toString(): string };
  email?: string;
};

async function getAuthUserId(email: string): Promise<string | undefined> {
  const authUser = await authDb.collection<AuthUserDocument>("user").findOne({
    email: email.toLowerCase()
  });

  if (!authUser) return undefined;
  return authUser.id ?? authUser._id?.toString();
}

async function ensureAuthUser(user: (typeof seedUsers)[number]): Promise<string> {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: user.name,
        email: user.email,
        password: user.password
      }
    });

    if (!result.user?.id) {
      throw new Error(`Could not create auth user for ${user.email}`);
    }

    return result.user.id;
  } catch (error) {
    const authUserId = await getAuthUserId(user.email);
    if (authUserId) {
      return authUserId;
    }
    throw error;
  }
}

async function syncUser(user: (typeof seedUsers)[number]) {
  const authUserId: string = await ensureAuthUser(user);
  await User.findOneAndUpdate(
    { email: user.email.toLowerCase() },
    {
      authUserId,
      name: user.name,
      email: user.email.toLowerCase(),
      role: user.role,
      isActive: true,
      isVerified: true
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  console.log(`Synced ${user.email} as ${user.role}`);
}

async function main() {
  await mongoose.connect(env.MONGODB_URI);
  await client.connect();

  for (const user of seedUsers) {
    await syncUser(user);
  }

  await DepartmentModel.deleteMany({});
  await DepartmentModel.insertMany(departmentSeed);

  console.log(`Seeded ${departmentSeed.length} departments and ${seedUsers.length} users.`);

  console.log("\nLogin credentials:");
  for (const user of seedUsers) {
    console.log(`${user.email} / ${user.password}`);
  }

  await mongoose.disconnect();
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
