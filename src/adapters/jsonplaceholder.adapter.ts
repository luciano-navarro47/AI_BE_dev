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

// TO DO: implement 'https://jsonplaceholder.typicode.com/comments'