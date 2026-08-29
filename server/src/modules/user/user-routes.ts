import { Router } from "express";

import { authorizePermission } from "../../middlewares/authorize.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { UserController } from "./user-controller.js";
import { createUserSchema, updateUserSchema, userIdSchema, userListQuerySchema } from "./user-validation.js";

export const userRouter = Router();

userRouter.get("/me", (req, res, next) => UserController.getCurrentUser(req, res, next));

userRouter.post("/", authorizePermission("users:create"), validateRequest(createUserSchema), (req, res, next) =>
  UserController.createUser(req, res, next)
);

userRouter.get("/", authorizePermission("users:view"), validateRequest(userListQuerySchema), (req, res, next) =>
  UserController.getUsers(req, res, next)
);

userRouter.get("/:id", authorizePermission("users:view"), validateRequest(userIdSchema), (req, res, next) =>
  UserController.getUserById(req, res, next)
);

userRouter.patch(
  "/:id",
  authorizePermission("users:update"),
  validateRequest(userIdSchema),
  validateRequest(updateUserSchema),
  (req, res, next) => UserController.updateUser(req, res, next)
);

userRouter.delete("/:id", authorizePermission("users:delete"), validateRequest(userIdSchema), (req, res, next) =>
  UserController.deleteUser(req, res, next)
);
