import jwt, { JwtPayload } from 'jsonwebtoken';

const hour = 1 * 60 * 60 * 1000;
const week = 7 * 24 * 60 * 60 * 1000;

export const createToken = (
  payload: JwtPayload,
  rememberMe = false
): { token: string; expiresIn: string } => {
  const expiresIn = rememberMe ? week : hour;
  const token = jwt.sign(payload, process.env.JWT_SECRET as unknown as string, {
    expiresIn,
  });
  return { token, expiresIn: expiresIn.toString() };
};

export const verifyToken = (
  token: string
): { isValid: boolean; data?: JwtPayload } => {
  try {
    const data = jwt.verify(
      token,
      process.env.JWT_SECRET as unknown as string
    ) as unknown as JwtPayload;
    return {
      isValid: true,
      data,
    };
  } catch (err) {
    return {
      isValid: false,
    };
  }
};
