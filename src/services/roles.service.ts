import { createRole, getAllRoles, getRoleById } from "../repositories/roles.repository";

const allowedRoles = new Set<string>(["admin", "personal"]);

export function isRoleAllowed(roleName: string) {
    if(!roleName || typeof roleName !== "string") return false;
    return allowedRoles.has(roleName.toLocaleLowerCase());
}

export const createRoleService = async (name: string) => {
    try {
        const newRole = await createRole(name);
        return { ok: true, status: 201, data: newRole };
    } catch (error) {
        return { ok: false, status: 500, error: error as string };
    }
}

export const getRolesService = async () => {
    try {
        const roles = await getAllRoles();
        return { ok: true, status: 200, data: roles };

    } catch (error) {
        return { ok: false, status: 500, error: error as string };
    }
}

export const getRoleByIdService = async (id: string) => {
    try {
        const role = await getRoleById(id);
        return { ok: true, status: 200, data: role };
    } catch (error) {
        return { ok: false, status: 500, error: error as string };
    }
}