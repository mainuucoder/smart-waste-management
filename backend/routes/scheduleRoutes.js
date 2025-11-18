const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const { protect } = require('../middleware/authMiddleware');
// Protect all schedule routes
router.use(protect);

// Get all schedules for current user
router.get('/', async (req, res) => {
  try {
    console.log('📅 GET /api/schedules called for user:', req.user._id);
    const schedules = await Schedule.find({ user_id: req.user._id }).sort({ date: -1, time: 1 });

    console.log(`✅ Returning ${schedules.length} schedules for user ${req.user._id}`);
    res.json(schedules);
  } catch (error) {
    console.error('❌ Error fetching schedules:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Create new schedule for current user
router.post('/', async (req, res) => {
  const { route_id, date, time, frequency, collector_ids, notes } = req.body;

  try {
    console.log('📅 POST /api/schedules called for user:', req.user._id);
    console.log('Request body:', req.body);

    // Basic validation
    if (!route_id || !date || !time || !frequency) {
      return res.status(400).json({ error: 'Route ID, date, time, and frequency are required' });
    }

    const schedule = new Schedule({
      user_id: req.user._id,
      route_id,
      date,
      time,
      frequency,
      collector_ids: collector_ids || [],
      notes: notes || '',
      status: 'scheduled'
    });

    await schedule.save();
    console.log('✅ Schedule created for user:', schedule._id);
    
    res.status(201).json(schedule);
  } catch (error) {
    console.error('❌ Error creating schedule:', error);
    res.status(500).json({ error: 'Failed to create schedule: ' + error.message });
  }
});

// Get schedule by ID for current user
router.get('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ _id: req.params.id, user_id: req.user._id });
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (error) {
    console.error('❌ Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Update schedule for current user
router.put('/:id', async (req, res) => {
  const { route_id, date, time, frequency, status, collector_ids, notes } = req.body;

  try {
    const updateData = {
      route_id,
      date,
      time,
      frequency,
      status: status || 'scheduled',
      notes: notes || ''
    };

    if (collector_ids !== undefined) {
      updateData.collector_ids = collector_ids;
    }

    const schedule = await Schedule.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (error) {
    console.error('❌ Error updating schedule:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});

// Delete schedule for current user
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting schedule:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

// Update schedule status for current user
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;

  try {
    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const schedule = await Schedule.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (error) {
    console.error('❌ Error updating schedule status:', error);
    res.status(500).json({ error: 'Failed to update schedule status' });
  }
});


module.exports = router;