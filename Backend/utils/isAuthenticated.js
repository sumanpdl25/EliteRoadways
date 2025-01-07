import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

 const isAuthenticated = async (req, res, next) => {
  // Get the token from the cookie
  const token = req.cookies.token; // Assuming token is stored in cookies

  // If there's no token, reject the request
  if (!token) {
    return res.status(403).json({ success: false, message: 'No token provided' });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the user from the database using the userID from the token
    const user = await User.findById(decoded.userID); // Ensure the `userID` is correct and the user exists

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Set the user object on the request
    req.user = user; // Add the user info to the request object
    next(); // Proceed to the next middleware/handler

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
export default isAuthenticated;