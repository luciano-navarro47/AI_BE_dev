import { Request, Response } from "express";
import { createRoleService, getRolesService, getRoleByIdService } from "../services/roles.service";

export const createRoleController = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const result = await createRoleService(name);

        if (!result.ok) {
            return res.status(result.status).json({ message: result.error });
        }

        return res.status(201).json(result.data);
    } catch (err) {
        console.error("createRoleController error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getRolesController = async (req: Request, res: Response) => {
    try {
        const result = await getRolesService();

        if (!result.ok) {
            return res.status(result.status).json({ message: result.error });
        }

        return res.status(200).json(result.data);
    } catch (err) {
        console.error("getRolesController error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getRoleByIdController = async (req: Request, res: Response) => {
    try {
        const roleId = req.params.roleId;

        if (!roleId) {
            return res.status(400).json({ message: "Role ID is required" });
        }

        const result = await getRoleByIdService(roleId);

        if (!result.ok) {
            return res.status(result.status).json({ message: result.error });
        }

        return res.status(200).json(result.data);
    } catch (err) {
        console.error("getRoleByIdController error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};