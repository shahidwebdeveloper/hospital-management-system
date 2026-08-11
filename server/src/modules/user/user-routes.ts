import { Router } from "express";

import { UserController } from "./user-controller.js";
import { authorize } from "../../middlewares/authorize.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { createUserSchema, updateUserSchema, userIdSchema } from "./user-validation.js";
import { authenticate } from "../../middlewares/authenticate.js";

export const userRouter = Router();

userRouter.post(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  validateRequest(createUserSchema),
  (req, res, next) => UserController.createUser(req, res, next)
);

userRouter.get("/", authenticate, authorize(["super_admin", "admin"]), (req, res, next) =>
  UserController.getUsers(req, res, next)
);

userRouter.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  validateRequest(userIdSchema),
  (req, res, next) => UserController.getUserById(req, res, next)
);

userRouter.patch(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  validateRequest(userIdSchema),
  validateRequest(updateUserSchema),
  (req, res, next) => UserController.updateUser(req, res, next)
);

userRouter.delete(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  validateRequest(userIdSchema),
  (req, res, next) => UserController.deleteUser(req, res, next)
);
