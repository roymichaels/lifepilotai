const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
  console.log('[Auth Utils] Generating access token for user:', user.email);
  console.log('[Auth Utils] JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('[Auth Utils] JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
  
  if (!process.env.JWT_SECRET) {
    console.error('[Auth Utils] JWT_SECRET is not defined in environment variables');
    throw new Error('JWT_SECRET environment variable is required');
  }

  const payload = {
    userId: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('[Auth Utils] Access token generated successfully');
  return token;
}

function generateRefreshToken(user) {
  console.log('[Auth Utils] Generating refresh token for user:', user.email);
  console.log('[Auth Utils] JWT_REFRESH_SECRET exists:', !!process.env.JWT_REFRESH_SECRET);
  console.log('[Auth Utils] JWT_REFRESH_SECRET length:', process.env.JWT_REFRESH_SECRET ? process.env.JWT_REFRESH_SECRET.length : 0);
  
  if (!process.env.JWT_REFRESH_SECRET) {
    console.error('[Auth Utils] JWT_REFRESH_SECRET is not defined in environment variables');
    throw new Error('JWT_REFRESH_SECRET environment variable is required');
  }

  const payload = {
    userId: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  console.log('[Auth Utils] Refresh token generated successfully');
  return token;
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};