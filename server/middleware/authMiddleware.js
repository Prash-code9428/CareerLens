import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes and authenticate requests using JWT
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, token missing'
        });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({
          success: false,
          message: 'JWT_SECRET is not configured on server'
        });
      }

      const decoded = jwt.verify(token, secret);

      // Attach user object to request (excluding password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists'
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired'
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Not authorized, Bearer token required'
  });
};
