import bcrypt from "bcryptjs";
import { signJwt } from "../lib/jwt";
import { getUserByEmail } from "../repositories/users.repository";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

interface ServiceResult {
    ok: boolean;
    status: number;
    data?: any;
    error?: string;
}

export const loginService = async (email: string, password: string): Promise<ServiceResult> => {
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return { ok: false, status: 401, error: "Invalid credentials" };
        }

        const match = await bcrypt.compare(password, user.passwordHash || user.roleId || "");
        if (!match) {
            return { ok: false, status: 401, error: "Invalid credentials" };
        }

        const payload = { userId: user.id, roleId: user.roleId, email: user.email };
        const token = signJwt(
            payload,
            JWT_SECRET,
            JWT_EXPIRES_IN
        );

        return {
            ok: true,
            status: 200,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    roleId: user.roleId
                }
            }
        };
    } catch (err) {
        console.error("loginService error:", err);
        return { ok: false, status: 500, error: "Internal server error" };
    }
};
