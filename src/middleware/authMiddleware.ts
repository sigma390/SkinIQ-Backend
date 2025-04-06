import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import { verifyToken } from '../utils/jwtUtils';

// Extended Request interface to include user property
export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Middleware to protect routes that require authentication
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = verifyToken(token);

      if (!decoded) {
        res.status(401).json({ message: 'Not authorized, token failed' });
        return;
      }

      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Add user to request object
      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};
