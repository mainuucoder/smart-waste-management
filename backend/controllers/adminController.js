const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Report = require('../models/Report');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const completedReports = await Report.countDocuments({ status: 'completed' });
    const inProgressReports = await Report.countDocuments({ status: 'in_progress' });

    // Get user counts by role
    const admins = await User.countDocuments({ role: 'admin' });
    const drivers = await User.countDocuments({ role: 'driver' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admins,
          drivers,
          regularUsers
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
          inProgress: inProgressReports,
          completed: completedReports
        }
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching dashboard stats');
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.json({
    success: true,
    data: user
  });
});

// @desc    Get users by role
// @route   GET /api/admin/users/role/:role
// @access  Private/Admin
const getUsersByRole = asyncHandler(async (req, res) => {
  const { role } = req.params;
  
  const users = await User.find({ role }).select('-password').sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Create new user (by admin)
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    phone,
    address
  });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, phone, address, role } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.address = address || user.address;
  user.role = role || user.role;

  const updatedUser = await user.save();

  res.json({
    success: true,
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address
    }
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent deleting yourself
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot delete your own account');
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Change user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role || !['user', 'admin', 'driver'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role. Must be user, admin, or driver');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent changing your own role
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot change your own role');
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: `User role updated to ${role}`,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Reset user password
// @route   PATCH /api/admin/users/:id/reset-password
// @access  Private/Admin
const resetUserPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

// @desc    Bulk delete users
// @route   POST /api/admin/users/bulk-delete
// @access  Private/Admin
const bulkDeleteUsers = asyncHandler(async (req, res) => {
  const { userIds } = req.body;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    res.status(400);
    throw new Error('Please provide an array of user IDs');
  }

  // Prevent deleting yourself
  if (userIds.includes(req.user._id.toString())) {
    res.status(400);
    throw new Error('Cannot delete your own account');
  }

  const result = await User.deleteMany({ _id: { $in: userIds } });

  res.json({
    success: true,
    message: `${result.deletedCount} users deleted successfully`,
    deletedCount: result.deletedCount
  });
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  getUsersByRole,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  resetUserPassword,
  bulkDeleteUsers
};