import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import axios from 'axios';

export interface AuthUser { id: string; username: string; role: string }
export interface AuthRequest extends Request { user?: AuthUser }

const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');
    if (!token) return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    const decoded = jwt.verify(token, (process.env.ACCESS_TOKEN_PRIVATE_KEY || '') as Secret) as AuthUser;
    try {
      const r = await axios.get(`${userServiceUrl}/api/users/profile`, { headers: { Authorization: `Bearer ${token}` } });
      if (r.data?.success) {
        req.user = { id: r.data.user.id || r.data.user._id, username: r.data.user.username, role: r.data.user.role || decoded.role };
        return next();
      }
      return res.status(401).json({ success: false, message: 'Invalid token. User not found.' });
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid token. User verification failed.' });
    }
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};


