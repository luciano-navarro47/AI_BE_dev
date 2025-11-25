/*
To avoid making queries to DynamoDB on every login if the roles are fixed and few.

This is a simple example, in a real app you might want to use a more complex
caching strategy or even a database for roles.
*/

const rolesMap = new Map<string, string>([
    ["1", "admin"],
    ["2", "personal"],
])

export function isRoleAllowed(roleId: string) {
    const roleName = rolesMap.get(roleId);
    return roleName === "admin" || roleName === "personal";
}