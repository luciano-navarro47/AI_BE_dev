import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const user = (req as any).user;

        if (!user || !allowedRoles.includes(user.roleId)) {
            return res.status(403).json({ error: "Forbidden: role not allowed" });
        }

        next();
    };
};
 