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

    /**
     * Get Better Auth session
     */
    const session = await auth.api.getSession({
      headers
    });

    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    /**
     * Find the corresponding HMS user.
     *
     * We use the email because your HMS User
     * already stores the same email as Better Auth.
     */
    const hmsUser = await User.findOne(
      {
        email: session.user.email.toLowerCase()
      },
      {
        password: 0
      }
    );

    if (!hmsUser) {
      return res.status(404).json({
        success: false,
        message: "HMS user not found"
      });
    }

    /**
     * Check whether the HMS account is active.
     */
    if (!hmsUser.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive"
      });
    }

    /**
     * Attach the authenticated HMS user
     * to the Express request.
     */
    req.user = {
      id: hmsUser.id,
      name: hmsUser.name,
      email: hmsUser.email,
      role: hmsUser.role
    };

    return next();
  } catch (error) {
    return next(error);
  }
}
