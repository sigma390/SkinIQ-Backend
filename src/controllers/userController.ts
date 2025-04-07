import { Request, Response } from 'express';
import { Multer } from 'multer';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import { generateUserResponse } from '../utils/jwtUtils';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password, // In a real app, this should be hashed
    });

    if (user) {
      // Generate token and return user data
      res.status(201).json(generateUserResponse(user));
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && password === user.password) {
      // In a real app, compare with hashed password
      // Generate token and return user data
      res.json(generateUserResponse(user));
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Extended AuthRequest interface to include file from multer
interface FileAuthRequest extends AuthRequest {
  file?: Express.Multer.File;
}

// @desc    Upload skin image
// @route   POST /api/users/upload-image
// @access  Private
export const uploadSkinImage = async (
  req: FileAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No image uploaded' });
      return;
    }

    // Get the file path
    const filePath = req.file.path;
    const fileName = req.file.filename;

    // Create the url (relative path for local storage)
    const fileUrl = `/uploads/skin-images/${fileName}`;

    // Update user's skin image in database
    user.skinImage = {
      url: fileUrl,
      id: fileName,
    };

    await user.save();

    res.status(200).json({
      message: 'Image uploaded successfully',
      skinImage: user.skinImage,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
