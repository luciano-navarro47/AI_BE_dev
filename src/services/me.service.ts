import axios from "axios";

export const getMyInfoService = async (userId: string) => {
    try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");
        const users = response.data;

        const user = users.find((u: any) => u.id === Number(userId));

        if (!user) {
            return { ok: false, status: 404, error: "User not found" };
        }

        return { ok: true, status: 200, data: user };
    } catch (err) {
        console.error("getMyInfoService error:", err);
        return { ok: false, status: 500, error: "Internal server error" };
    }
};
