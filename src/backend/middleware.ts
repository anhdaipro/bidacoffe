import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from './models/Users';
import multer from 'multer';
declare global {
    namespace Express {
      interface Request {
        user?: User;
      }
    }
  }
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
interface UserPayload {
    id: number;
    username: string;
    roleId: number;
    // thêm các field khác nếu token có, ví dụ: email, role,...
  }
  
export const  authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token không được cung cấp' });
    return;
  }

  try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const user = await User.findByPk(decoded.id )
        if (!user) {
            throw new Error()
        }
        req.user = user
        next()
  } catch (error) {
    res.status(403).json({ message: 'Token không hợp lệ' });
  }
};


export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({ message: 'Kích thước file không được vượt quá 1MB.' });
      }
  }
  next();
};