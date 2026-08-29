import { auth } from "../../lib/auth.js";
import { User } from "./user-model.js";
import { ApiError } from "../../utils/api-error.js";
import type { CreateUserInput, UpdateUserInput, UserActor, UserListOptions } from "./user-types.js";

function canAssignRole(actor: UserActor, role: CreateUserInput["role"]) {
  if (actor.role === "super_admin") return true;
  return actor.role === "admin" && !["super_admin", "admin"].includes(role);
}

function assertRoleChangeAllowed(actor: UserActor, targetId: string, requestedRole?: CreateUserInput["role"]) {
  if (actor.id === targetId && requestedRole) throw new ApiError(403, "You cannot change your own role");
  if (requestedRole && !canAssignRole(actor, requestedRole)) throw new ApiError(403, "You cannot assign this role");
}

async function assertTargetManageAllowed(actor: UserActor, targetId: string) {
  const target = await User.findById(targetId).select("role").lean();
  if (!target) return;
  if (actor.role !== "super_admin" && ["super_admin", "admin"].includes(target.role)) {
    throw new ApiError(403, "Only a super administrator can manage administrator accounts");
  }
}

export class UserService {
  /**
   * Create a new HMS user
   */
  static async createUser(data: CreateUserInput, actor: UserActor) {
    if (!canAssignRole(actor, data.role)) throw new ApiError(403, "You cannot create a user with this role");
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
        ,createdBy: actor.id,
        updatedBy: actor.id
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
  static async getUsers(options: UserListOptions) {
    const filters: Record<string, unknown> = {};
    if (options.role) filters.role = options.role;
    if (options.isActive !== undefined) filters.isActive = options.isActive;
    if (options.search) {
      const expression = { $regex: options.search, $options: "i" };
      filters.$or = [{ name: expression }, { email: expression }, { phone: expression }];
    }
    const [items, total] = await Promise.all([
      User.find(filters).sort({ createdAt: -1 }).skip((options.page - 1) * options.limit).limit(options.limit),
      User.countDocuments(filters)
    ]);
    return { items, total, page: options.page, limit: options.limit, pages: Math.ceil(total / options.limit) };
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
  static async updateUser(id: string, data: UpdateUserInput, actor: UserActor) {
    /**
     * Never store the password in the HMS User collection.
     */
    const { password: _password, ...userData } = data;
    await assertTargetManageAllowed(actor, id);
    assertRoleChangeAllowed(actor, id, userData.role);
    if (actor.id === id && userData.isActive === false) throw new ApiError(403, "You cannot deactivate your own account");
    if (userData.isActive === false) {
      userData.deactivatedAt = new Date() as never;
      userData.deactivatedBy = actor.id as never;
    } else if (userData.isActive === true) {
      userData.deactivatedAt = undefined;
      userData.deactivatedBy = undefined;
    }
    userData.updatedBy = actor.id as never;

    return User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true
    });
  }

  /**
   * Delete HMS user
   */
  static async deactivateUser(id: string, actor: UserActor) {
    if (actor.id === id) throw new ApiError(403, "You cannot deactivate your own account");
    await assertTargetManageAllowed(actor, id);
    return User.findByIdAndUpdate(id, { isActive: false, deactivatedAt: new Date(), deactivatedBy: actor.id, updatedBy: actor.id }, { new: true });
  }
}
