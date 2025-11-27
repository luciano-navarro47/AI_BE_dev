import axios from "axios";

const BASE = "https://jsonplaceholder.typicode.com";

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
