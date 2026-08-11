import type { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth.js";

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

    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: "super_admin"
    };

    return next();
  } catch (error) {
    return next(error);
  }
}
