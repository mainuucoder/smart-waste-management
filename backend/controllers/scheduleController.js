const Schedule = require('../models/Schedule');
const Route = require('../models/Route');

// @desc    Get all schedules
// @route   GET /api/schedules
// @access  Public
exports.getAllSchedules = async (req, res) => {
  try {
    console.log('📅 Fetching all schedules...');
    
    const schedules = await Schedule.find()
      .populate('route_id', 'name start_point end_point distance')
      .populate('collector_ids', 'name email phone')
      .sort({ date: 1, time: 1 });
    
    console.log(`✅ Found ${schedules.length} schedules`);
    
    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('❌ Error fetching schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedules',
      error: error.message
    });
  }
};

// @desc    Get single schedule by ID
// @route   GET /api/schedules/:id
// @access  Public
exports.getScheduleById = async (req, res) => {
  try {
    console.log(`📅 Fetching schedule with ID: ${req.params.id}`);
    
    const schedule = await Schedule.findById(req.params.id)
      .populate('route_id', 'name start_point end_point distance')
      .populate('collector_ids', 'name email phone');
    
    if (!schedule) {
      console.log('❌ Schedule not found');
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }
    
    console.log('✅ Schedule found');
    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('❌ Error fetching schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedule',
      error: error.message
    });
  }
};

// @desc    Create new schedule
// @route   POST /api/schedules
// @access  Private/Admin
exports.createSchedule = async (req, res) => {
  try {
    console.log('📅 Creating new schedule...');
    console.log('Request body:', req.body);

    const { route_id, date, time, frequency, collector_ids, notes } = req.body;

    // Validation
    if (!route_id || !date || !time || !frequency) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Route, date, time, and frequency are required'
      });
    }

    // Check if route exists
    const routeExists = await Route.findById(route_id);
    if (!routeExists) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Validate frequency
    const validFrequencies = ['once', 'daily', 'weekly', 'monthly'];
    if (!validFrequencies.includes(frequency)) {
      return res.status(400).json({
        success: false,
        message: `Invalid frequency. Must be one of: ${validFrequencies.join(', ')}`
      });
    }

    // Create schedule
    const schedule = await Schedule.create({
      route_id,
      date,
      time,
      frequency,
      collector_ids: collector_ids || [],
      notes: notes || '',
      status: 'scheduled'
    });

    // Populate before sending response
    const populatedSchedule = await Schedule.findById(schedule._id)
      .populate('route_id', 'name start_point end_point')
      .populate('collector_ids', 'name email');

    console.log('✅ Schedule created successfully:', schedule._id);
    
    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: populatedSchedule
    });
  } catch (error) {
    console.error('❌ Error creating schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating schedule',
      error: error.message
    });
  }
};

// @desc    Update schedule
// @route   PUT /api/schedules/:id
// @access  Private/Admin
exports.updateSchedule = async (req, res) => {
  try {
    console.log(`📅 Updating schedule with ID: ${req.params.id}`);
    console.log('Update data:', req.body);

    // Find schedule
    let schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      console.log('❌ Schedule not found');
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Validate status if being updated
    if (req.body.status) {
      const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    // Validate frequency if being updated
    if (req.body.frequency) {
      const validFrequencies = ['once', 'daily', 'weekly', 'monthly'];
      if (!validFrequencies.includes(req.body.frequency)) {
        return res.status(400).json({
          success: false,
          message: `Invalid frequency. Must be one of: ${validFrequencies.join(', ')}`
        });
      }
    }

    // Check if route exists if being updated
    if (req.body.route_id) {
      const routeExists = await Route.findById(req.body.route_id);
      if (!routeExists) {
        return res.status(404).json({
          success: false,
          message: 'Route not found'
        });
      }
    }

    // Update schedule
    schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('route_id', 'name start_point end_point')
      .populate('collector_ids', 'name email');

    console.log('✅ Schedule updated successfully');
    
    res.status(200).json({
      success: true,
      message: 'Schedule updated successfully',
      data: schedule
    });
  } catch (error) {
    console.error('❌ Error updating schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating schedule',
      error: error.message
    });
  }
};

// @desc    Update schedule status
// @route   PATCH /api/schedules/:id/status
// @access  Private
exports.updateScheduleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`📅 Updating schedule status to: ${status}`);

    // Validate status
    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('route_id', 'name start_point end_point')
      .populate('collector_ids', 'name email');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    console.log('✅ Schedule status updated successfully');
    
    res.status(200).json({
      success: true,
      message: 'Schedule status updated successfully',
      data: schedule
    });
  } catch (error) {
    console.error('❌ Error updating schedule status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating schedule status',
      error: error.message
    });
  }
};

// @desc    Assign collectors to schedule
// @route   PATCH /api/schedules/:id/collectors
// @access  Private/Admin
exports.assignCollectors = async (req, res) => {
  try {
    const { collector_ids } = req.body;
    console.log(`📅 Assigning collectors to schedule: ${req.params.id}`);

    if (!Array.isArray(collector_ids)) {
      return res.status(400).json({
        success: false,
        message: 'collector_ids must be an array'
      });
    }

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { collector_ids },
      { new: true, runValidators: true }
    )
      .populate('route_id', 'name start_point end_point')
      .populate('collector_ids', 'name email phone');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    console.log('✅ Collectors assigned successfully');
    
    res.status(200).json({
      success: true,
      message: 'Collectors assigned successfully',
      data: schedule
    });
  } catch (error) {
    console.error('❌ Error assigning collectors:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning collectors',
      error: error.message
    });
  }
};

// @desc    Delete schedule
// @route   DELETE /api/schedules/:id
// @access  Private/Admin
exports.deleteSchedule = async (req, res) => {
  try {
    console.log(`📅 Deleting schedule with ID: ${req.params.id}`);
    
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    
    if (!schedule) {
      console.log('❌ Schedule not found');
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    console.log('✅ Schedule deleted successfully');
    
    res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('❌ Error deleting schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting schedule',
      error: error.message
    });
  }
};

// @desc    Get schedules by status
// @route   GET /api/schedules/status/:status
// @access  Public
exports.getSchedulesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    console.log(`📅 Fetching schedules with status: ${status}`);
    
    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const schedules = await Schedule.find({ status })
      .populate('route_id', 'name start_point end_point')
      .populate('collector_ids', 'name email')
      .sort({ date: 1, time: 1 });
    
    console.log(`✅ Found ${schedules.length} schedules with status: ${status}`);
    
    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('❌ Error fetching schedules by status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedules',
      error: error.message
    });
  }
};

// @desc    Get schedules by date range
// @route   GET /api/schedules/range/:startDate/:endDate
// @access  Public
exports.getSchedulesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    console.log(`📅 Fetching schedules from ${startDate} to ${endDate}`);
    
    const schedules = await Schedule.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    })
      .populate('route_id', 'name start_point end_point')
      .populate('collector_ids', 'name email')
      .sort({ date: 1, time: 1 });

    console.log(`✅ Found ${schedules.length} schedules in range`);
    
    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('❌ Error fetching schedules by range:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedules',
      error: error.message
    });
  }
};

// @desc    Get schedules by route
// @route   GET /api/schedules/route/:routeId
// @access  Public
exports.getSchedulesByRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    console.log(`📅 Fetching schedules for route: ${routeId}`);
    
    const schedules = await Schedule.find({ route_id: routeId })
      .populate('route_id', 'name start_point end_point')
      .populate('collector_ids', 'name email')
      .sort({ date: 1, time: 1 });
    
    console.log(`✅ Found ${schedules.length} schedules for route`);
    
    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('❌ Error fetching schedules by route:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedules',
      error: error.message
    });
  }
};