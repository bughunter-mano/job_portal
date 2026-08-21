const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Access denied. No token provided.', 
      code: 'TOKEN_MISSING' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');
    req.admin = decoded; // Contains id and email
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Session expired. Please login again.', 
        code: 'TOKEN_EXPIRED' 
      });
    }
    return res.status(401).json({ 
      message: 'Invalid authorization token.', 
      code: 'TOKEN_INVALID' 
    });
  }
};

module.exports = adminAuth;
