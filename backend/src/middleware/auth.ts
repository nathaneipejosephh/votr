import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface User {
      id: string;
      googleId: string;
      email: string;
      name: string;
      picture?: string;
    }
  }
}

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized. Please sign in.' });
};

// Middleware to optionally get user (doesn't require auth)
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  // Just continue - user info will be available if authenticated
  next();
};
