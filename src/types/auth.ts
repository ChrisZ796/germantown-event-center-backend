import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userID: number;
    username?: string;
  };
}
