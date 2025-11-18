const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Schedule = require('../models/Schedule'); // Add this import
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  getUsersByRole,
  getDashboardStats,
  bulkDeleteUsers,
  resetUserPassword,
} = require('../controllers/adminController');

// ========================================
// ALL ROUTES REQUIRE ADMIN AUTHENTICATION
// ========================================
router.use(protect);  // Must be logged in
router.use(adminOnly); // Must be admin

// Dashboard & Statistics
router.get('/stats', getDashboardStats);

// ADD THIS - Get all schedules (admin only)
// In your adminRoutes.js - Ensure proper population
// ADD this route:
router.get('/schedules', async (req, res) => {
  try {
    const Schedule = require('../models/Schedule');
    const schedules = await Schedule.find({})
      .populate('collector_ids', 'name email') // This populates collector names
      .sort({ date: -1, time: 1 });
    
    res.json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADD THIS - Update schedule status (admin only)
router.patch('/schedules/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user_id', 'name email username')
     .populate('collector_ids', 'name email username role');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      data: schedule,
      message: 'Schedule status updated successfully'
    });
  } catch (error) {
    console.error('❌ ADMIN Error updating schedule status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating schedule status: ' + error.message
    });
  }
});

// ADD THIS - Assign collectors to schedule (admin only)
router.patch('/schedules/:id/collectors', async (req, res) => {
  try {
    const { collector_ids } = req.body;

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { collector_ids: collector_ids || [] },
      { new: true, runValidators: true }
    ).populate('user_id', 'name email username')
     .populate('collector_ids', 'name email username role');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      data: schedule,
      message: 'Collectors assigned successfully'
    });
  } catch (error) {
    console.error('❌ ADMIN Error assigning collectors:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning collectors: ' + error.message
    });
  }
});

// Reports Management (keep your existing one)
router.get('/reports', async (req, res) => {
  try {
    const Report = require('../models/Report');
    const reports = await Report.find({})
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 100);
    
    res.json({
      success: true,
      data: reports,
      count: reports.length
    });
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports: ' + error.message
    });
  }
});

// User Management (keep your existing routes)
router.route('/users')
  .get(getAllUsers)
  .post(createUser);

router.get('/users/role/:role', getUsersByRole);

router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.patch('/users/:id/role', changeUserRole);
router.patch('/users/:id/reset-password', resetUserPassword);
router.post('/users/bulk-delete', bulkDeleteUsers);

// In your adminRoutes.js - UPDATE the assign collectors route
router.patch('/schedules/:id/collectors', async (req, res) => {
  try {
    const { collector_ids } = req.body;

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { collector_ids: collector_ids || [] },
      { new: true, runValidators: true }
    )
    .populate('user_id', 'name email username')
    .populate('collector_ids', 'name email username role'); // Make sure this populate is working

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    console.log('✅ ADMIN: Updated collectors for schedule:', schedule._id);
    console.log('Assigned collectors:', schedule.collector_ids);

    res.json({
      success: true,
      data: schedule,
      message: 'Collectors assigned successfully'
    });
  } catch (error) {
    console.error('❌ ADMIN Error assigning collectors:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning collectors: ' + error.message
    });
  }
});

module.exports = router;