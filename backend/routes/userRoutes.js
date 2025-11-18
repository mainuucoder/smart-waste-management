// const express = require('express');
// const router = express.Router();
// const {
//   registerUser,
//   loginUser,
//   getUserProfile,
//   updateUserProfile,
// } = require('../controllers/userController');
// const { protect } = require('../middleware/authMiddleware');

// console.log('📝 Loading userRoutes...');

// // Test route - ADD THIS
// router.get('/', (req, res) => {
//   res.json({ 
//     message: 'Users API is working!',
//     availableEndpoints: [
//       'POST /api/users/register',
//       'POST /api/users/login', 
//       'GET /api/users/profile (protected)',
//       'PUT /api/users/profile (protected)'
//     ]
//   });
// });

// // Public routes
// router.post('/register', registerUser);
// router.post('/login', loginUser);

// // Protected routes
// router.route('/profile')
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);

// console.log('✅ userRoutes loaded');

// module.exports = router;


// for testing
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

console.log('📝 Loading userRoutes...');

// TEST ROUTES - Temporary for browser testing
router.get('/register', (req, res) => {
  res.json({ 
    message: 'Register endpoint - use POST to register a user',
    example: {
      method: 'POST',
      url: '/api/users/register',
      body: {
        name: 'Your Name',
        email: 'your@email.com',
        password: 'yourpassword'
      }
    }
  });
});

router.get('/login', (req, res) => {
  res.json({ 
    message: 'Login endpoint - use POST to login',
    example: {
      method: 'POST',
      url: '/api/users/login',
      body: {
        email: 'your@email.com',
        password: 'yourpassword'
      }
    }
  });
});

// Root route
router.get('/', (req, res) => {
  res.json({ 
    message: 'Users API is working!',
    availableEndpoints: [
      'GET /api/users - This message',
      'GET /api/users/register - Info about registration',
      'GET /api/users/login - Info about login',
      'POST /api/users/register - Register a new user',
      'POST /api/users/login - Login user',
      'GET /api/users/profile - Get user profile (protected)',
      'PUT /api/users/profile - Update user profile (protected)'
    ]
  });
});

// Your existing POST routes (keep these!)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

console.log('✅ userRoutes loaded');

module.exports = router;