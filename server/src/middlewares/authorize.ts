import type { NextFunction, Request, Response } from "express";

import { hasPermission, permissionRoles } from "@hms/contracts";
import type { AppRole, Permission } from "@hms/contracts";

import { resourceDefinitionMap } from "../modules/resources/resource-definitions.js";

function forbidden(res: Response) {
  return res.status(403).json({
    success: false,
    message: "You do not have permission to perform this action"
  });
}

export function authorize(allowedRoles: readonly AppRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
      return next();
    }

    return forbidden(res);
  };
}

export function authorizePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (hasPermission(user.role, permission)) {
      return next();
    }

    return forbidden(res);
  };
}

export function authorizeResource() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceParam = req.params.resource ?? req.query.resource;

      if (typeof resourceParam !== "string" || !resourceParam) {
        return res.status(400).json({
          success: false,
          message: "Missing resource"
        });
      }

      const definition = resourceDefinitionMap.get(resourceParam as never);

      if (!definition) {
        return res.status(404).json({
          success: false,
          message: "Unknown resource"
        });
      }

      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      if (!definition.allowedRoles.includes(user.role)) {
        return forbidden(res);
      }

      return next();
    } catch (error) {
      return next(error as Error);
    }
  };
}

export { permissionRoles };
export default authorize;
