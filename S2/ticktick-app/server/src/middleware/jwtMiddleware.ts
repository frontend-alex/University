import jwt, { Secret } from 'jsonwebtoken';
import { config } from '../config/config';
import { createError } from './errorHandler';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '../types/Enums';
import { JwtUtils } from '../utils/jwt/jwtUtils';
import { SubscriptionTier } from '../models/user';

export interface DecodedUser {
  id: string;
  username: string;
  role: UserRole;
  tier: SubscriptionTier;
  iat: number;
  exp: number;
}

export const jwtMiddleware: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) throw createError('JWT_EXPIRED_TOKEN');

  try {
    const decrypted = JwtUtils.decryptToken(token);
    if (!decrypted) throw createError('INVALID_ENCRYPTED_TOKEN');

    const decoded = jwt.verify(decrypted, config.JWT_SECRET as Secret) as DecodedUser;
    if(!decoded) throw createError('JWT_INVALID_TOKEN');

    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      tier: decoded.tier
    };

    next(); 
  } catch (err) {
    next(createError('JWT_INVALID_TOKEN'));
  }
};
