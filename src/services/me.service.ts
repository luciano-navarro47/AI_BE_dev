import {
  findUserByEmail,
  getCommentsByPostId,
  getPostById,
  getPostsByUserId,
} from "../adapters/jsonplaceholder.adapter";

const verifyPostOwnership = async (userEmail: string, postId: string) => {
  const placeholderUser = await findUserByEmail(userEmail);

  if (!placeholderUser) {
    return { status: 404, error: "External API User not found" };
  }
  const placeholderUserId = placeholderUser.id;

  const post = await getPostById(postId);

  if (!post || !post.id) {
    return { status: 404, error: `Post not found with this ID: ${postId}` };
  }

  if (post.userId !== placeholderUserId) {
    return { status: 403, error: "You are not authorized to access this post" };
  }
  return { post };
};

export const getMyInfoService = async (userEmail: string) => {
  try {
    const user = await findUserByEmail(userEmail);

    if (!user) {
      return { ok: false, status: 404, error: "User not found" };
    }

    return { ok: true, status: 200, data: user };
  } catch (err) {
    return { ok: false, status: 500, error: "Internal server error" };
  }
};

export const getPostsService = async (userEmail: string) => {
  try {
    const placeholderUser = await findUserByEmail(userEmail);

    if (!placeholderUser) {
      return { ok: false, status: 404, error: "External API user not found" };
    }

    const placeholderUserId = placeholderUser.id;
    const posts = await getPostsByUserId(placeholderUserId);

    if (!posts || posts.length === 0) {
      return { ok: false, status: 404, error: "Posts not found for this user" };
    }

    return { ok: true, status: 200, data: posts };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      error: "Internal server error during API call",
    };
  }
};

export const getPostDetailService = async (
  userEmail: string,
  postId: string
) => {
  try {
    const validationResult = await verifyPostOwnership(userEmail, postId);

    if (validationResult.status) {
      return {
        ok: false,
        status: validationResult.status,
        error: validationResult.error,
      };
    }

    return { ok: true, status: 200, data: validationResult.post };
  } catch (error) {
    const status = (error as any).response?.status || 500;
    return {
      ok: false,
      status: status,
      error:
        status === 404
          ? `Post not found with this ID: ${postId}`
          : "Internal server error during API call",
    };
  }
};

export const getPostCommentsService = async (
  userEmail: string,
  postId: string
) => {
  try {
    const validationResult = await verifyPostOwnership(userEmail, postId);

    if (validationResult.status) {
      return {
        ok: false,
        status: validationResult.status,
        error: validationResult.error,
      };
    }
    const comments = await getCommentsByPostId(postId);

    return { ok: true, status: 200, data: comments };
  } catch (error) {
    const status = (error as any).response?.status || 500;
    return {
      ok: false,
      status: status,
      error:
        status === 404
          ? `Post not found with this ID: ${postId}`
          : "Internal server error during API call",
    };
  }
};
