const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Recipe = require('../models/Recipe');

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, age, height, weight, gender } = req.body;

  try {
    if (!email || !password || !name)
      return res.status(400).json({ error: 'Missing required fields' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name, email, password: hashedPassword, age, height, weight, gender
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// Register Admin (Only Admins can register other admins)
const registerAdmin = async (req, res) => {
  const { name, email, password, age, height, weight, gender } = req.body;

  try {
    if (!email || !password || !name)
      return res.status(400).json({ error: 'Missing required fields' });

    // Check if the user is an admin (by checking the role from the authMiddleware)
    if (req.user.role !== 'admin')
      return res.status(403).json({ error: 'Only admins can register new admins' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      height,
      weight,
      gender,
      role: 'admin', // New user will be an admin
    });

    await newUser.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};


// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    //  Send role explicitly here
    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id,
      role: user.role, // <--- This is critical
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};



// Get Profile
const getProfile = async (req, res) => {
  try {
    // Ensure req.user exists and has an id
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    const user = await User.findById(req.user.id).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user); // Return user profile data
  } catch (err) {
    console.error('Error fetching user profile:', err); // Log the error for debugging
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  const { name, age, height, weight, gender } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, age, height, weight, gender },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Error updating profile' });
  }
};

// Change Password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect old password' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error changing password' });
  }
};

// Get Current User (Minimal Info)
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ error: 'User not found' });

    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      height: user.height,
      weight: user.weight,
      gender: user.gender,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

const getUserRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    const recipes = await Recipe.find({ addedBy: userId }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user recipes' });
  }
};

// Delete User (Admin Only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

// Get All Users (admin-only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

const updateUserByAdmin = async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    //console.log('Incoming role:', role);
    const normalizedRole = role?.toLowerCase();
    if (role && ['user', 'admin'].includes(normalizedRole)) {
      user.role = normalizedRole;
    } else {
      return res.status(400).json({ error: 'Invalid role value' });
    }

    const updated = await user.save();
    res.json({ message: 'User role updated successfully', user: updated });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Failed to update user role', details: err.message });
  }
};


// controllers/userController.js

const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.deleteOne();
    await Recipe.deleteMany({ addedBy: user._id });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};


module.exports = {
  registerUser,
  registerAdmin,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  getCurrentUser,
  getUserRecipes,
  deleteUser,
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
};
