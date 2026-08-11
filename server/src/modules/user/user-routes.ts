import { Router } from "express";

import { UserController } from "./user-controller.js";

import { authorize } from "../../middlewares/authorize.js";
import { validateRequest } from "../../middlewares/validate-request.js";

import { createUserSchema, updateUserSchema, userIdSchema } from "./user-validation.js";

export const userRouter = Router();

/**
 * GET CURRENT USER
 *
 * The apiRouter already runs authenticate
 * before reaching this router.
 *
 * Therefore we do NOT need authenticate here again.
 */
userRouter.get("/me", (req, res, next) => UserController.getCurrentUser(req, res, next));

/**
 * CREATE USER
 */
userRouter.post(
  "/",
  authorize(["super_admin", "admin"]),
  validateRequest(createUserSchema),
  (req, res, next) => UserController.createUser(req, res, next)
);

/**
 * GET ALL USERS
 */
userRouter.get("/", authorize(["super_admin", "admin"]), (req, res, next) =>
  UserController.getUsers(req, res, next)
);

/**
 * GET USER BY ID
 */
userRouter.get(
  "/:id",
  authorize(["super_admin", "admin"]),
  validateRequest(userIdSchema),
  (req, res, next) => UserController.getUserById(req, res, next)
);

/**
 * UPDATE USER
 */
userRouter.patch(
  "/:id",
  authorize(["super_admin", "admin"]),
  validateRequest(userIdSchema),
  validateRequest(updateUserSchema),
  (req, res, next) => UserController.updateUser(req, res, next)
);

/**
 * DELETE USER
 */
userRouter.delete(
  "/:id",
  authorize(["super_admin", "admin"]),
  validateRequest(userIdSchema),
  (req, res, next) => UserController.deleteUser(req, res, next)
);
