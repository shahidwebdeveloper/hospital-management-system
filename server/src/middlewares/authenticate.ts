import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { env } from "../config/env.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: any | null;
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const headers = fromNodeHeaders(req.headers as Record<string, string>);

    // Call the Better Auth handler directly to resolve the session for this request.
    // Use the configured auth base path (/api/auth) - call the get-session endpoint.
    const url = new URL(`${env.BETTER_AUTH_URL.replace(/\/$/, "")}/api/auth/get-session`);

    const request = new Request(url.toString(), {
      method: "GET",
      headers
    });

    const response = await auth.handler(request as any);
    if (!response) {
      req.user = null;
      return next();
    }

    const text = await response.text();
    if (!text) {
      req.user = null;
      return next();
    }

    const parsed = JSON.parse(text);
    // Better Auth returns { session, user } or null
    req.user = parsed?.user ?? null;

    return next();
  } catch (error) {
    return next(error);
  }
}

export default authenticate;
