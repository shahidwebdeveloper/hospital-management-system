import { auth } from "../../lib/auth.js";
import { User } from "./user-model.js";
import type { CreateUserInput, UpdateUserInput } from "./user-types.js";

export class UserService {
  /**
   * Create a new HMS user
   */
  static async createUser(data: CreateUserInput) {
    /**
     * 1. Create the authentication account through Better Auth.
     *
     * Better Auth is responsible for:
     * - password hashing
     * - authentication
     * - sessions
     * - login
     */
    const authResult = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password
      }
    });

    /**
     * 2. Make sure Better Auth returned a user.
     */
    if (!authResult.user) {
      throw new Error("Unable to create authentication account");
    }

    /**
     * 3. Create the HMS user.
     *
     * We do NOT store the password here.
     *
     * authUserId connects this HMS user to the
     * corresponding Better Auth user.
     */
    try {
      const user = await User.create({
        authUserId: authResult.user.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        isActive: data.isActive ?? true,
        isVerified: data.isVerified ?? false
      });

      return user;
    } catch (error) {
      /**
       * If creating the HMS user fails after Better Auth
       * created the account, we throw the error.
       *
       * The Better Auth account can be cleaned up later
       * with a dedicated rollback/delete flow if needed.
       */
      throw error;
    }
  }

  /**
   * Get all HMS users
   */
  static async getUsers() {
    return User.find({}).sort({ createdAt: -1 });
  }

  /**
   * Get HMS user by HMS MongoDB ID
   */
  static async getUserById(id: string) {
    return User.findById(id);
  }

  /**
   * Get HMS user by email
   *
   * Used by the authentication middleware and
   * /users/me endpoint to find the HMS profile
   * belonging to the authenticated Better Auth user.
   */
  static async getUserByEmail(email: string) {
    return User.findOne({
      email: email.toLowerCase().trim()
    });
  }

  /**
   * Update HMS user
   *
   * Password changes are handled by Better Auth,
   * not by the HMS User model.
   */
  static async updateUser(id: string, data: UpdateUserInput) {
    /**
     * Never store the password in the HMS User collection.
     */
    const { password: _password, ...userData } = data;

    return User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true
    });
  }

  /**
   * Delete HMS user
   */
  static async deleteUser(id: string) {
    return User.findByIdAndDelete(id);
  }
}
