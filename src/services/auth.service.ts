import bcrypt from "bcryptjs";
import { signJwt } from "../lib/jwt";
import { getUserByEmail } from "../repositories/users.repository";
import { isRoleAllowed } from "./roles.service";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

interface ServiceResult {
  ok: boolean;
  status: number;
  data?: any;
  error?: string;
}

export const loginService = async (
  email: string,
  password: string
): Promise<ServiceResult> => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return { ok: false, status: 401, error: "Invalid credentials" };
    }

    const match = await bcrypt.compare(password, user.password || "");
    if (!match) {
      return { ok: false, status: 401, error: "Invalid password" };
    }

    if (!isRoleAllowed(user.role)) {
      return { ok: false, status: 403, error: "Forbidden: role not allowed" };
    }

    const payload = { userId: user.id, role: user.role, email: user.email };
    const token = signJwt(payload, JWT_SECRET, JWT_EXPIRES_IN);

    return {
      ok: true,
      status: 200,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    };
  } catch (err) {
    console.error("loginService error:", err);
    return { ok: false, status: 500, error: "Internal server error" };
  }
};
