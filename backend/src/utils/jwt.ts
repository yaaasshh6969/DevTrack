import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  const secret: Secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign({ userId }, secret, options);
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const secret: Secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key';
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
