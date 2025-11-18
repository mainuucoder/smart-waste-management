// backend/models/Schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['once', 'daily', 'weekly', 'monthly'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  collector_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collector'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);