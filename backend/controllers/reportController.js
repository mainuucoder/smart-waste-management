const Report = require('../models/Report');

// @desc    Get all reports for user
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const reports = await Report.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      message: 'Reports retrieved successfully',
      data: reports,
      count: reports.length
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports'
    });
  }
};

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    const report = await Report.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Report created successfully!',
      data: report
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
// @desc    Get all reports (with filters)
// @route   GET /api/reports
// @access  Private
const getReport = asyncHandler(async (req, res) => {
  const { status, category, priority, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};

  // Only show user's own reports if not admin
  if (req.user && req.user.role !== 'admin' && req.user.role !== 'worker') {
    query.user = req.user._id;
  }

  if (status) query.status = status;
  if (category) query.category = category;
  if (priority) query.priority = priority;

  // Pagination
  const skip = (page - 1) * limit;

  try {
    const reports = await Report.find(query)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const count = await Report.countDocuments(query);

    res.json({
      success: true,
      data: reports,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get Reports Error:', error);
    res.status(500);
    throw new Error('Failed to fetch reports');
  }
});
// @desc    Update report status
// @route   PUT /api/reports/:id/status
// @access  Private
const updateReportStatus = async (req, res) => {
  try {
    const report = await Report.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { status: req.body.status, updatedAt: new Date() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report status updated',
      data: report
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating report'
    });
  }
};

module.exports = {
  getReports,
  createReport,
  getReport,
  updateReportStatus
};