const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

console.log('📝 Loading reportRoutes...');

// Simple test route first
router.get('/test', (req, res) => {
  res.json({ message: 'Reports test route is working!' });
});

// GET /api/reports - Get all reports (Protected)
router.get('/', protect, async (req, res) => {
  try {
    console.log('📊 Fetching reports for user:', req.user._id);
    
    const { limit = 50 } = req.query;
    
    // Try to import Report model
    let Report;
    try {
      Report = require('../models/Report');
    } catch (error) {
      console.log('❌ Report model not found, using sample data');
      // Return sample data if model doesn't exist
      return res.json({
        success: true,
        message: 'Reports retrieved successfully',
        data: [
          {
            _id: 'sample_1',
            title: 'Sample Report - Plastic Waste',
            description: 'This is sample data until database is setup',
            category: 'plastic',
            location: { address: 'Sample Location' },
            status: 'pending',
            priority: 'medium',
            createdBy: req.user._id,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        count: 1
      });
    }
    
    // Get real reports from database
    const reports = await Report.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    console.log(`✅ Found ${reports.length} reports in database`);
    
    res.json({
      success: true,
      message: 'Reports retrieved successfully',
      data: reports,
      count: reports.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports: ' + error.message
    });
  }
});

// POST /api/reports - Create new report (Protected)
router.post('/', protect, async (req, res) => {
  try {
    console.log('📨 Creating new report:', req.body);
    
    // Try to import Report model
    let Report;
    try {
      Report = require('../models/Report');
    } catch (error) {
      console.log('❌ Report model not found, cannot save to database');
      return res.status(500).json({
        success: false,
        message: 'Report model not configured. Please create models/Report.js'
      });
    }
    
    // Create report in database
    const report = await Report.create({
      ...req.body,
      createdBy: req.user._id
    });

    console.log('✅ Report saved to database:', report._id);
    
    res.status(201).json({
      success: true,
      message: 'Report created successfully!',
      data: report
    });
    
  } catch (error) {
    console.error('❌ Error creating report:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create report: ' + error.message
    });
  }
});

console.log('✅ reportRoutes loaded');

module.exports = router;