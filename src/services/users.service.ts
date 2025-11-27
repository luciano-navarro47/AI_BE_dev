import {
  createUser,
  getUserById,
  getAllUsers,
  getUserByEmail,
} from "../repositories/users.repository";
import { getAllPlaceholderUsers } from "../adapters/jsonplaceholder.adapter";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

type Payload = { email: string; role: string; password: string };

export const createUserService = async (data: Payload) => {
  try {
    if (!data.email || !data.role || !data.password) {
      return { ok: false, status: 400, error: "Missing required fields" };
    }

    let apiUsers;
    try {
      apiUsers = await getAllPlaceholderUsers();
    } catch (err: any) {
      return {
        ok: false,
        status: 500,
        error: "Internal server error: Failed to reach external API",
      };
    }

    const existsInApi = apiUsers.some((u: any) => u.email === data.email);

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
      role: data.role,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedUser = await createUser(newUser);

    return { ok: true, status: 201, data: savedUser };
  } catch (err: any) {
    return { ok: false, status: 500, error: "Internal server error" };
  }
};

export const getAllUsersService = async () => {
  try {
    const users = await getAllUsers();
    return { ok: true, status: 200, data: users };
  } catch (err: any) {
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
    return { ok: false, status: 500, error: "Internal server error" };
  }
};
