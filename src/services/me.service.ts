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

export const getMyPostDetailService = async (userId: string, postId: string) => {

    try {
        const POSTS_API_URL = `https://jsonplaceholder.typicode.com/posts/${postId}`;
        const response = await axios.get(POSTS_API_URL);
        const post = response.data;

        if (!post || !post.id) {
            return { ok: false, status: 404, error: `Post not found with this ID: ${postId}` }
        }

        if (post.userId !== Number(userId)) {
            return { ok: false, status: 403, error: "You are not authorized to access this post" }
        }

        return { ok: true, status: 200, data: post }
    } catch (error) {
        console.error("getMyPostDetailService error:", error);
        return { ok: false, status: 500, error: "Internal server error during API call" }
    }
}

export const getMyPostCommentsService = async (userId: string, postId: string) => {
    try {
        const postVerificationUrl = `https://jsonplaceholder.typicode.com/posts/${postId}`;
        const postRespone = await axios.get(postVerificationUrl);
        const post = postRespone.data;

        if (post.userId !== Number(userId)) {
            return {
                ok: false,
                status: 403,
                error: "Forbidden: You do not have permission to view comments for this post"
            };
        }

        const COMMENTS_API_URL = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;

        const commentsResponse = await axios.get(COMMENTS_API_URL);
        const comments = commentsResponse.data;

        return { ok: true, status: 200, data: comments };
    } catch (error) {
        console.error("getMyPostCommentsService error:", error);
        return { ok: false, status: 500, error: "Internal server error during API call" }
    }
}