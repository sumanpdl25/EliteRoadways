import  bcryptjs  from "bcryptjs";
import User from "../models/user.model.js";
import  jwt  from "jsonwebtoken";
import Bus from "../models/bus.model.js";

export const loginhandeler = async (req, res) => {
  const { email, password } = req.body;
  const match = await User.findOne({ email });
  if (!match) {
    return res.status(404).json({ success: false, message: "User not found" });
  } else {
    const isMatch = await bcryptjs.compare(password, match.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    } else {
      const payload = {
        userID: match._id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res
        .cookie("token", token)
        .status(200)
        .json({ success: true, message: "login success" });
    }
  }
};

export const signuphandeler = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

  
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

  
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role, 
    });
  
    const payload = {
      userID: newUser._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      })
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logouthandeler = (req, res) => {
    res
        .cookie("token", null, {
            expires: new Date(0),       
            httpOnly: true,              
            secure: process.env.NODE_ENV === 'production',  
            sameSite: 'strict',     
        })
        .json({ success: true, message: "User logged out" });
  };
  
  


export const profile = (req, res) => {
  
  res.json({
    success: true,
    user: req.user, // The user info is available here
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); 
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    //  check if the user is an admin
    const userToDelete = await User.findById(userId);
    
    if (!userToDelete) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Prevent deletion of admin users
    if (userToDelete.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin users cannot be deleted'
      });
    }
    
    // Find all buses with bookings by this user
    const buses = await Bus.find();
    
    // Remove the user's bookings from each bus
    for (const bus of buses) {
      if (bus.bookedBy) {
        // Get seats booked by this user
        const userBookings = Array.from(bus.bookedBy.entries())
          .filter(([_, booking]) => booking.userId.toString() === userId)
          .map(([seat]) => seat);
        
        // Remove seats from bookedSeats array
        bus.bookedSeats = bus.bookedSeats.filter(seat => !userBookings.includes(seat));
        
      
        userBookings.forEach(seat => bus.bookedBy.delete(seat));
        
        await bus.save();
      }
    }
    
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    res.status(200).json({ 
      success: true, 
      message: 'User and their bookings deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting user',
      error: error.message 
    });
  }
};
