import axios from "axios";

const POSTS_API_URL = "https://jsonplaceholder.typicode.com/posts";
const AXIOS_TIMEOUT = 5000;

export const getAllPostsService = async () => {
    try {
        const res = await axios.get(POSTS_API_URL, { timeout: AXIOS_TIMEOUT });
        const posts = Array.isArray(res.data) ? res.data : [];
        return { ok: true, status: 200, data: posts };
    } catch (err: any) {
        console.error("getAllPostsService error:", err?.message ?? err);
        return { ok: false, status: 502, error: "Failed to fetch posts from external API" };
    }
};

export const getPostByIdService = async (postId: string) => {
    try {
        if (!postId) return { ok: false, status: 400, error: "Post ID is required" };

        try {
            const res = await axios.get(`${POSTS_API_URL}/${encodeURIComponent(postId)}`, { timeout: AXIOS_TIMEOUT });
            if (!res.data || Object.keys(res.data).length === 0) {
                return { ok: false, status: 404, error: "Post not found" };
            }
            return { ok: true, status: 200, data: res.data };
        } catch (err: any) {

            if (err.response && err.response.status === 404) {
                return { ok: false, status: 404, error: "Post not found" };
            }
            console.error("getPostByIdService error (axios):", err?.message ?? err);
            return { ok: false, status: 502, error: "Failed to fetch post from external API" };
        }
    } catch (err: any) {
        console.error("getPostByIdService error:", err);
        return { ok: false, status: 500, error: "Internal server error" };
    }
};
