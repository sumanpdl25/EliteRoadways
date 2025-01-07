// Middleware to check for admin role
 export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: "Permission denied" });
  };
  
  // Middleware to check for user role
  const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
      return next();
    }
    return res.status(403).json({ message: "Permission denied" });
  };
  