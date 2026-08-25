const jwt = require('jsonwebtoken');

const generateToken = (userOrId, role = 'customer', email = '') => {
  const payload = typeof userOrId === 'object' && userOrId !== null
    ? { id: userOrId._id || userOrId.id, _id: userOrId._id || userOrId.id, role: userOrId.role || role, email: userOrId.email || email }
    : { id: userOrId, _id: userOrId, role, email };

  const secret = process.env.JWT_SECRET || 'krishi_market_default_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRE || '30d';

  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = generateToken;