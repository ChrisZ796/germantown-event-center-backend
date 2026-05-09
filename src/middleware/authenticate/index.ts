import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../../types/auth';

export const authenticateToken: RequestHandler = (req, res, next) => {
  const token = (req as AuthRequest).cookies?.token || req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userID: number;
      username?: string;
    };

    // cast req to AuthRequest to assign user
    (req as AuthRequest).user = { userID: decoded.userID, username: decoded.username };
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

