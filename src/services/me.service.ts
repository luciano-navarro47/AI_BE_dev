import axios from "axios";

// refactor this service later
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
// refactor this service later

export const getMyPostsService = async (userId: string) => {
    try {
        const POSTS_API_URL = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;
        const response = await axios.get(POSTS_API_URL);
        const posts = response.data;

        if (!posts || posts.length === 0) {
            return { ok: false, status: 404, error: "Posts not found for this user" };
        }

        return { ok: true, status: 200, data: posts };
    } catch (err) {
        console.error("getMyPostsService error:", err);
        return { ok: false, status: 500, error: "Internal server error during API call" };
    }
};