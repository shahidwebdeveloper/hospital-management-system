/* eslint-disable @typescript-eslint/no-namespace */

import type { UserRole } from "../modules/user/user-types.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
      };
      authorizedResource?: unknown;
    }
  }
}

export {};
