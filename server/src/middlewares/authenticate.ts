import type { NextFunction, Request, Response } from "express";

import { auth } from "../lib/auth.js";
import { User } from "../modules/user/user-model.js";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") {
        headers.set(key, value);
      }
    }

    const session = await auth.api.getSession({
      headers
    });

    if (!session?.user?.email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const normalizedEmail = session.user.email.toLowerCase().trim();

    let hmsUser = await User.findOne(
      {
        email: normalizedEmail
      },
      {
        password: 0
      }
    );

    if (!hmsUser) {
      hmsUser = await User.create({
        authUserId: session.user.id,
        name: session.user.name || normalizedEmail.split("@")[0] || "HMS User",
        email: normalizedEmail,
        role: "patient",
        isActive: true,
        isVerified: Boolean(session.user.emailVerified)
      });
    }

    if (!hmsUser.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive"
      });
    }

    req.user = {
      id: String(hmsUser._id),
      name: hmsUser.name,
      email: hmsUser.email,
      role: hmsUser.role
    };

    return next();
  } catch (error) {
    return next(error);
  }
}

