import axios from "axios";

const BASE = "https://jsonplaceholder.typicode.com";
const COMMENTS_API = `${BASE}/comments`;
const USERS_API = `${BASE}/users`;
const POSTS_API = `${BASE}/posts`;
const AXIOS_TIMEOUT = 5000;

export async function getAllPlaceholderUsers() {
  const { data } = await axios.get(USERS_API, { timeout: AXIOS_TIMEOUT });
  return Array.isArray(data) ? data : [];
}

export async function getPlaceholderUserById(placeholderId: string) {
  const { data } = await axios.get(`${USERS_API}/${placeholderId}`, {
    timeout: AXIOS_TIMEOUT,
  });
  return data;
}

export async function findUserByEmail(email: string) {
  const { data } = await axios.get(`${USERS_API}`, { params: { email } });
  return data[0] || null;
}

export async function getPostsByUserId(userId: number) {
  const { data } = await axios.get(`${POSTS_API}`, { params: { userId } });
  return data;
}

export async function getPostById(postId: string) {
  const { data } = await axios.get(`${POSTS_API}/${postId}`);
  return data;
}

export async function getCommentsByPostId(postId: string) {
  const { data } = await axios.get(`${POSTS_API}/${postId}/comments`);
  return data;
}

export async function getAllComments() {
  const { data } = await axios.get(`${COMMENTS_API}`, {
    timeout: AXIOS_TIMEOUT,
  });
  return Array.isArray(data) ? data : [];
}

export async function getCommentById(commentId: string) {
  const { data } = await axios.get(
    `${COMMENTS_API}/${encodeURIComponent(commentId)}`,
    { timeout: AXIOS_TIMEOUT }
  );
  return data;
}
