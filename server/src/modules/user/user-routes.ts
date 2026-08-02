import { Router } from "express";
import { User } from "./user-model.js";
import { authorize } from "../../middlewares/authorize.js";

export const userRouter = Router();

// List users (admin-only)
userRouter.get("/", authorize(["super_admin", "admin"]), async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 }).lean();
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

// Update user (role changes) - admin-only
userRouter.put("/:id", authorize(["super_admin", "admin"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) return res.status(400).json({ message: "role is required" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    const out = user.toObject();
    delete (out as any).password;

    res.json({ user: out });
  } catch (err) {
    next(err);
  }
});
