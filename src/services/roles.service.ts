import { createRole, getAllRoles, getRoleById } from "../repositories/roles.repository";

// Roles caché (persist if is needed in some service)
export const rolesMap = new Map<string, string>([
    ["1", "admin"],
    ["2", "personal"],
])

export function isRoleAllowed(roleId: string) {
    const roleName = rolesMap.get(roleId);
    return roleName === "admin" || roleName === "personal";
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