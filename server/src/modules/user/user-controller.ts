import type { NextFunction, Request, Response } from "express";

import { UserService } from "./user-service.js";

export class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.validatedBody as any);

      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getUsers();

      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(String(req.params.id ?? ""));

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id ?? "");
      const updatedUser = await UserService.updateUser(id, req.validatedBody as any);

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id ?? "");
      const deletedUser = await UserService.deleteUser(id);

      if (!deletedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
