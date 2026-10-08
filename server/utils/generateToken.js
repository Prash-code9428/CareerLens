import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT for a given user ID
 * @param {string} userId - User's MongoDB _id
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured in the environment.');
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: '7d'
  });
};
