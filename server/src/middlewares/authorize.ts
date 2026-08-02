import type { Request, Response, NextFunction } from "express";
import { resourceDefinitionMap } from "../modules/resources/resource-definitions.js";

export function authorize(allowedRoles: string[] | readonly string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!allowedRoles || allowedRoles.length === 0) return next();

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return next();
  };
}

export function authorizeResource() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const resource = String(req.params.resource ?? req.query.resource ?? "");

      if (!resource) return res.status(400).json({ success: false, message: "Missing resource" });

      const definition = resourceDefinitionMap.get(resource as any);

      if (!definition) return res.status(404).json({ success: false, message: "Unknown resource" });

      const user = req.user as any;

      if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

      if (!definition.allowedRoles.includes(user.role)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      return next();
    } catch (error) {
      return next(error as Error);
    }
  };
}

export default authorize;
