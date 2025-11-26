import axios from "axios";
import {
    createUser,
    getUserById,
    getAllUsers,
    getUserByEmail
} from "../repositories/users.repository";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const USERS_API_URL = "https://jsonplaceholder.typicode.com/users";
const AXIOS_TIMEOUT = 5000;

type Payload = { email: string, role: string, password: string };

export const createUserService = async (data: Payload) => {
    try {

        if (!data.email || !data.role || !data.password) {
            return { ok: false, status: 400, error: "Missing required fields" };
        }

        let apiRes;
        try {
            apiRes = await axios.get(USERS_API_URL, { timeout: AXIOS_TIMEOUT });
        } catch (err: any) {
            console.error("createUserService error:", err);
            return { ok: false, status: 500, error: "Internal server error" };
        }

        const existsInApi = apiRes.data.some((u: any) => u.email === data.email);

        if (!existsInApi) {
            return { ok: false, status: 400, error: "User not found in test API" };
        }

        const existingUser = await getUserByEmail(data.email);
        if (existingUser) {
            return { ok: false, status: 400, error: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = {
            id: uuidv4(),
            email: data.email,
            roleId: data.role,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const savedUser = await createUser(newUser);

        return { ok: true, status: 201, data: savedUser };
    } catch (err: any) {
        console.error("createUserService error:", err);
        return { ok: false, status: 500, error: "Internal server error" };
    }
};

export const getAllUsersService = async () => {
    try {
        const users = await getAllUsers();
        return { ok: true, status: 200, data: users };
    } catch (err: any) {
        console.error("getAllUsersService error:", err);
        return { ok: false, status: 500, error: "Internal server error" };
    }
};

export const getUserByIdService = async (userId: string) => {
    try {
        const user = await getUserById(userId);
        if (!user) {
            return { ok: false, status: 404, error: "User not found" };
        }
        return { ok: true, status: 200, data: user };
    } catch (err: any) {
        console.error("getUserByIdService error:", err);
        return { ok: false, status: 500, error: "Internal server error" };
    }
};
