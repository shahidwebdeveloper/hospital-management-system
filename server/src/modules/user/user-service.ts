import bcrypt from "bcryptjs";

import { env } from "../../config/env.js";
import { User } from "./user-model.js";
import type { CreateUserInput, UpdateUserInput } from "./user-types.js";

export class UserService {
  static async createUser(data: CreateUserInput) {
    const passwordHash = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUNDS);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: passwordHash,
      phone: data.phone,
      role: data.role,
      isActive: data.isActive ?? true,
      isVerified: data.isVerified ?? false
    });

    const userObject = user.toObject();

    const userWithoutPassword = Object.fromEntries(
      Object.entries(userObject).filter(([key]) => key !== "password")
    );

    return userWithoutPassword;
  }

  static async getUsers() {
    return User.find({}, { password: 0 }).sort({ createdAt: -1 });
  }

  static async getUserById(id: string) {
    return User.findById(id, { password: 0 });
  }

  static async updateUser(id: string, data: UpdateUserInput) {
    const updateData = { ...data };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, env.BCRYPT_SALT_ROUNDS);
    }

    return User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      select: "-password"
    });
  }

  static async deleteUser(id: string) {
    return User.findByIdAndDelete(id);
  }
}
