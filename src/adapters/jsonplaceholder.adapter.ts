import axios from "axios";

const BASE = "https://jsonplaceholder.typicode.com";
const COMMENTS_API = `${BASE}/comments`;
const AXIOS_TIMEOUT = 5000;

export async function findUserByEmail(email: string) {
  const { data } = await axios.get(`${BASE}/users`, { params: { email } });
  return data[0] || null;
}

export async function getPostsByUserId(userId: number) {
  const { data } = await axios.get(`${BASE}/posts`, { params: { userId } });
  return data;
}

export async function getPostById(postId: string) {
  const { data } = await axios.get(`${BASE}/posts/${postId}`);
  return data;
}

export async function getCommentsByPostId(postId: string) {
  const { data } = await axios.get(`${BASE}/posts/${postId}/comments`);
  return data;
}

export async function getAllComments() {
  const { data } = await axios.get(COMMENTS_API, { timeout: AXIOS_TIMEOUT });
  return Array.isArray(data) ? data : [];
}

export async function getCommentById(commentId: string) {
  const { data } = await axios.get(
    `${COMMENTS_API}/${encodeURIComponent(commentId)}`,
    { timeout: AXIOS_TIMEOUT }
  );
  return data;
}
