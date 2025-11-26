import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isBlacklisted } from "../services/blacklist.service";

const JWT_SECRET = process.env.JWT_SECRET!;

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;

  if (!auth) return res.status(401).json({ error: "Missing authorization header" });

  const parts = auth.split(" ");
  const token = parts.length === 2 ? parts[1] : undefined;

  if (!token) return res.status(401).json({ error: "Missing token" });

  if (isBlacklisted(token)) return res.status(401).json({ error: "Token is blacklisted" })

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
