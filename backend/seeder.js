const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
const Report = require('./models/Report');
const Schedule = require('./models/Schedule');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// Sample Users Data
const users = [
  {
    name: 'Admin User',
    email: 'admin@wastemanagement.com',
    password: 'admin123',
    role: 'admin',
    phone: '+254700000001',
    address: {
      street: '1 Admin Street',
      city: 'Kisumu',
      state: 'Kisumu County',
      zipCode: '40100',
    },
  },
  {
    name: 'John Worker',
    email: 'worker@wastemanagement.com',
    password: 'worker123',
    role: 'worker',
    phone: '+254700000002',
    address: {
      street: '2 Worker Avenue',
      city: 'Kisumu',
      state: 'Kisumu County',
      zipCode: '40100',
    },
  },
  {
    name: 'Jane Citizen',
    email: 'jane@example.com',
    password: 'user123',
    role: 'user',
    phone: '+254700000003',
    address: {
      street: '10 Main Street',
      city: 'Kisumu',
      state: 'Kisumu County',
      zipCode: '40100',
    },
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'user123',
    role: 'user',
    phone: '+254700000004',
    address: {
      street: '25 Lake Road',
      city: 'Kisumu',
      state: 'Kisumu County',
      zipCode: '40100',
    },
  },
];

// Sample Reports Data
const reports = [
  {
    title: 'Overflowing bin at Market',
    description: 'The garbage bin near the market has been overflowing for 2 days',
    category: 'overflow',
    location: {
      type: 'Point',
      coordinates: [34.7519, -0.0917],
      address: 'Kisumu Central Market, Kisumu',
    },
    priority: 'high',
    status: 'pending',
  },
  {
    title: 'Uncollected waste on Main Street',
    description: 'Waste has not been collected for over a week',
    category: 'uncollected',
    location: {
      type: 'Point',
      coordinates: [34.7580, -0.0950],
      address: 'Main Street, Kisumu',
    },
    priority: 'medium',
    status: 'in_progress',
  },
  {
    title: 'Illegal dumping site',
    description: 'Someone is dumping construction waste illegally',
    category: 'illegal_dumping',
    location: {
      type: 'Point',
      coordinates: [34.7600, -0.1000],
      address: 'Industrial Area, Kisumu',
    },
    priority: 'urgent',
    status: 'pending',
  },
  {
    title: 'Damaged waste bin',
    description: 'The bin is damaged and needs replacement',
    category: 'damaged_bin',
    location: {
      type: 'Point',
      coordinates: [34.7450, -0.0880],
      address: 'Residential Area, Kisumu',
    },
    priority: 'low',
    status: 'resolved',
  },
];

// Sample Schedules Data
const schedules = [
  {
    area: 'Downtown Kisumu',
    wasteType: 'general',
    days: ['Monday', 'Thursday'],
    time: '07:00 AM',
    route: 'Route A',
    isActive: true,
  },
  {
    area: 'Milimani Estate',
    wasteType: 'general',
    days: ['Tuesday', 'Friday'],
    time: '06:30 AM',
    route: 'Route B',
    isActive: true,
  },
  {
    area: 'Downtown Kisumu',
    wasteType: 'recyclable',
    days: ['Wednesday'],
    time: '08:00 AM',
    route: 'Route A',
    isActive: true,
  },
  {
    area: 'Industrial Area',
    wasteType: 'hazardous',
    days: ['Saturday'],
    time: '09:00 AM',
    route: 'Route C',
    isActive: true,
  },
  {
    area: 'Nyalenda',
    wasteType: 'general',
    days: ['Monday', 'Thursday'],
    time: '10:00 AM',
    route: 'Route D',
    isActive: true,
  },
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Report.deleteMany();
    await Schedule.deleteMany();

    console.log('Data Destroyed...'.red.inverse);

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log('Users Imported...'.green.inverse);

    // Get admin user for schedules
    const adminUser = createdUsers[0]._id;
    const regularUser = createdUsers[2]._id;

    // Add user reference to reports
    const reportsWithUser = reports.map((report, index) => {
      return {
        ...report,
        user: index % 2 === 0 ? regularUser : createdUsers[3]._id,
      };
    });

    await Report.insertMany(reportsWithUser);
    console.log('Reports Imported...'.green.inverse);

    // Add createdBy reference to schedules
    const schedulesWithCreator = schedules.map((schedule) => {
      return {
        ...schedule,
        createdBy: adminUser,
      };
    });

    await Schedule.insertMany(schedulesWithCreator);
    console.log('Schedules Imported...'.green.inverse);

    console.log('Data Import Success!'.green.inverse.bold);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Destroy data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Report.deleteMany();
    await Schedule.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

// Usage:
// npm run seed          (import data)
// npm run seed -d       (destroy data)