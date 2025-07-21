const jwt = require('jsonwebtoken');
const UserService = require('../../services/userService.js');

const requireUser = async (req, res, next) => {
  try {
    console.log('[Auth Middleware] Processing authentication request');
    console.log('[Auth Middleware] Request URL:', req.url);
    console.log('[Auth Middleware] Request method:', req.method);

    const authHeader = req.headers.authorization;
    console.log('[Auth Middleware] Authorization header present:', !!authHeader);
    console.log('[Auth Middleware] Authorization header value:', authHeader ? authHeader.substring(0, 20) + '...' : 'null');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[Auth Middleware] No valid authorization header found');
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('[Auth Middleware] Token extracted, length:', token.length);
    console.log('[Auth Middleware] Token first 20 chars:', token.substring(0, 20) + '...');

    if (!process.env.JWT_SECRET) {
      console.error('[Auth Middleware] JWT_SECRET not found in environment');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    console.log('[Auth Middleware] JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('[Auth Middleware] JWT_SECRET length:', process.env.JWT_SECRET.length);

    console.log('[Auth Middleware] Attempting to verify token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[Auth Middleware] Token decoded successfully');
    console.log('[Auth Middleware] Decoded payload:', JSON.stringify(decoded, null, 2));
    console.log('[Auth Middleware] Decoded userId:', decoded.userId);
    console.log('[Auth Middleware] Decoded email:', decoded.email);

    if (!decoded.userId) {
      console.error('[Auth Middleware] No userId found in token payload');
      console.error('[Auth Middleware] Full decoded object:', decoded);
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload - no userId'
      });
    }

    console.log('[Auth Middleware] Fetching user from database with ID:', decoded.userId);
    const user = await UserService.get(decoded.userId);
    
    if (!user) {
      console.error('[Auth Middleware] User not found in database with ID:', decoded.userId);
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('[Auth Middleware] User authenticated successfully:', user.email);
    console.log('[Auth Middleware] User object keys:', Object.keys(user.toObject ? user.toObject() : user));
    req.user = user;
    next();

  } catch (error) {
    console.error('[Auth Middleware] Authentication error:', error.message);
    console.error('[Auth Middleware] Error name:', error.name);
    console.error('[Auth Middleware] Error stack:', error.stack);

    if (error.name === 'JsonWebTokenError') {
      console.error('[Auth Middleware] JWT Error details:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      console.error('[Auth Middleware] Token expired at:', error.expiredAt);
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = { requireUser };