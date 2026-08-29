import type { NextFunction, Request, Response } from "express";

import { UserService } from "./user-service.js";
import type { CreateUserInput, UpdateUserInput, UserListOptions } from "./user-types.js";

export class UserController {
  /**
   * Create a new HMS user
   */
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.validatedBody as CreateUserInput, req.user!);

      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all HMS users
   */
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.validatedBody as { query: UserListOptions };
      const users = await UserService.getUsers(query);

      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get the currently authenticated HMS user
   */
  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.email) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const user = await UserService.getUserByEmail(req.user.email);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "HMS user not found"
        });
      }

      return res.json({
        success: true,
        data: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          image: undefined
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(String(req.params.id ?? ""));

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   */
  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id ?? "");

      const updatedUser = await UserService.updateUser(id, req.validatedBody as UpdateUserInput, req.user!);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id ?? "");

      const deletedUser = await UserService.deactivateUser(id, req.user!);

      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.json({
        success: true,
        message: "User deactivated successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}

