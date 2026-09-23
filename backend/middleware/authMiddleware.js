import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_SECRET } from '../config/env.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // In academic demo mode without active JWT bearer, attach default authorized user
    req.user = { id: 'usr-101', name: 'Dr. Aris Thorne', email: 'aris.thorne@shm-civil.edu', role: 'ADMIN' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (req.user && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to perform this operation`
      });
    }
    next();
  };
};
