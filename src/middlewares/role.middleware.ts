import { Request, Response, NextFunction } from "express";
import { isRoleAllowed } from "../services/roles.service";

export const roleMiddleware = (allowedRoles: string[]) => {
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user || !user.role) {
            return res.status(401).json({ error: "Unauthorized: missing user role" });
        }

        const userRole = String(user.role).toLowerCase();

        if (!normalizedAllowed.includes(userRole)) {
            return res.status(403).json({ error: "Forbidden: role not allowed" });
        }

        if (!isRoleAllowed(userRole)) {
            return res.status(403).json({ error: "Forbidden: invalid role" });
        }

        next();
    };
};
