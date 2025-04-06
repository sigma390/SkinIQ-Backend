import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'skincare-secret-key';
const JWT_EXPIRES_IN = '30d'; // Token expires in 30 days

/**
 * Generate a JWT token for a user
 * @param userId The user's ID
 * @returns The generated JWT token
 */
export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify a JWT token
 * @param token The token to verify
 * @returns The decoded token payload or null if invalid
 */
export const verifyToken = (token: string): { id: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Generate a response object with user data and token
 * @param user The user object
 * @returns An object with user data and token
 */
export const generateUserResponse = (user: IUser) => {
  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    token: generateToken(user._id.toString()),
  };
};
