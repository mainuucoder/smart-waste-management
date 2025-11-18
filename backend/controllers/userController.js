const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });
// };
// Generate JWT Token - WITH DEBUGGING
const generateToken = (id) => {
  console.log('🔐 generateToken called with id:', id);
  console.log('🔐 JWT_SECRET available:', !!process.env.JWT_SECRET);
  console.log('🔐 JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'MISSING');
  
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    console.log('🔐 Token generated successfully (first 20 chars):', token.substring(0, 20) + '...');
    return token;
  } catch (error) {
    console.error('❌ Token generation error:', error.message);
    throw error;
  }
};
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // ADD THESE DEBUG LOGS:
  console.log('📨 RAW REQUEST BODY:', req.body);
  console.log('🔍 Headers:', req.headers);
  
  const { name, email, password, phone, address } = req.body;

  // Debug each field
  console.log('📋 Parsed fields:');
  console.log('  - name:', name, '(type:', typeof name, ')');
  console.log('  - email:', email, '(type:', typeof email, ')');
  console.log('  - password:', password ? '***' : 'MISSING', '(type:', typeof password, ')');
  console.log('  - phone:', phone);
  console.log('  - address:', address);

  // Validate input
  if (!name || !email || !password) {
    console.log('❌ VALIDATION FAILED:');
    console.log('   - name valid?:', !!name);
    console.log('   - email valid?:', !!email);
    console.log('   - password valid?:', !!password);
    res.status(400);
    throw new Error("Please add all required fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};