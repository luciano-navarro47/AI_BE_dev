import jwt from "jsonwebtoken";

export const signJwt = (
  payload: object,
  secret: string,
  expiresIn: string | number
): string => {
  return jwt.sign(
    payload,
    secret as jwt.Secret,
    {
      expiresIn,
    } as jwt.SignOptions
  );
};
