# 🗄️ Smart Waste Management Backend

Backend API for the Smart Waste Management System - Supporting SDG 11: Sustainable Cities and Communities

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Database Seeding](#database-seeding)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Testing](#testing)
- [Deployment](#deployment)

---

## ✨ Features

- ✅ User authentication with JWT
- ✅ Role-based access control (User, Worker, Admin)
- ✅ Waste report management with image uploads
- ✅ Geospatial queries for nearby reports
- ✅ Collection schedule management
- ✅ Admin dashboard with statistics
- ✅ Cloudinary integration for image storage
- ✅ Input validation and error handling
- ✅ Password hashing with bcrypt
- ✅ Pagination support
- ✅ CORS enabled

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Multer | File upload handling |
| Cloudinary | Image storage |
| Express Async Handler | Error handling |

---

## 📁 Project Structure

```
backend/
│
├── config/
│   └── db.js                 # MongoDB connection
│
├── controllers/
│   ├── userController.js     # User logic
│   ├── reportController.js   # Report logic
│   ├── scheduleController.js # Schedule logic
│   └── adminController.js    # Admin logic
│
├── middleware/
│   ├── authMiddleware.js     # JWT authentication
│   ├── errorMiddleware.js    # Error handling
│   └── uploadMiddleware.js   # File upload config
│
├── models/
│   ├── User.js              # User schema
│   ├── Report.js            # Report schema
│   └── Schedule.js          # Schedule schema
│
├── routes/
│   ├── userRoutes.js        # User endpoints
│   ├── reportRoutes.js      # Report endpoints
│   ├── scheduleRoutes.js    # Schedule endpoints
│   └── adminRoutes.js       # Admin endpoints
│
├── utils/
│   └── cloudinary.js        # Cloudinary helpers
│
├── uploads/                 # Temporary file storage
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── server.js               # Entry point
├── seeder.js               # Database seeder
├── package.json            # Dependencies
└── README.md               # This file
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for image uploads)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/smart-waste-management.git
cd smart-waste-management/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create uploads folder**
```bash
mkdir uploads
```

4. **Setup environment variables**
```bash
cp .env.example .env
```
Then edit `.env` with your credentials.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/waste-management

# JWT Secret (Use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### Getting MongoDB URI
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string

### Getting Cloudinary Credentials
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

---

## ▶️ Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

### Health Check
Open browser and visit:
```
http://localhost:5000
```

You should see:
```json
{
  "message": "Smart Waste Management API",
  "version": "1.0.0",
  "status": "Running"
}
```

---

## 🌱 Database Seeding

### Import Sample Data
```bash
npm run seed
```

This creates:
- 4 sample users (1 admin, 1 worker, 2 regular users)
- 4 sample reports
- 5 sample collection schedules

### Destroy All Data
```bash
npm run seed -d
```

### Default Credentials After Seeding

**Admin Account:**
- Email: `admin@wastemanagement.com`
- Password: `admin123`

**Worker Account:**
- Email: `worker@wastemanagement.com`
- Password: `worker123`

**User Accounts:**
- Email: `jane@example.com` | Password: `user123`
- Email: `bob@example.com` | Password: `user123`

---

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API reference.

### Quick Reference

**Base URL:** `http://localhost:5000/api`

**Authentication Routes:**
- POST `/users/register` - Register new user
- POST `/users/login` - Login user

**Report Routes:**
- POST `/reports` - Create report (with image upload)
- GET `/reports` - Get all reports (with filters)
- GET `/reports/:id` - Get single report
- GET `/reports/nearby` - Get nearby reports
- PUT `/reports/:id` - Update report
- DELETE `/reports/:id` - Delete report

**Schedule Routes:**
- GET `/schedules` - Get all schedules
- GET `/schedules/today` - Get today's schedules
- POST `/schedules` - Create schedule (Admin only)
- PUT `/schedules/:id` - Update schedule (Admin only)
- DELETE `/schedules/:id` - Delete schedule (Admin only)

**Admin Routes:**
- GET `/admin/stats` - Dashboard statistics
- PUT `/admin/reports/:id/status` - Update report status
- PUT `/admin/reports/:id/assign` - Assign report to worker
- GET `/admin/users` - Get all users
- PUT `/admin/users/:id/role` - Update user role
- DELETE `/admin/users/:id` - Delete user

---

## 🔒 Authentication

### How It Works

1. User registers or logs in
2. Server returns a JWT token
3. Client stores token (localStorage/cookies)
4. Client sends token in Authorization header for protected routes

### Example Request
```javascript
fetch('http://localhost:5000/api/reports', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### Token Structure
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjVhMWIyYzNkNGU1ZjZnN2g4aTlqMCIsImlhdCI6MTY5Mzg4MjgwMCwiZXhwIjoxNjk2NDc0ODAwfQ.signature
```

Token expires in **30 days**.

---

## 🧪 Testing

### Manual Testing with Postman

1. Import the API endpoints into Postman
2. Register a new user
3. Copy the token from response
4. Add token to Postman's Authorization → Bearer Token
5. Test protected routes

### Testing Image Upload

Use Postman:
1. Set method to POST
2. URL: `http://localhost:5000/api/reports`
3. Authorization: Bearer Token
4. Body: form-data
5. Add fields:
   - `title`: (text)
   - `description`: (text)
   - `category`: (text)
   - `location[coordinates][0]`: 34.7519
   - `location[coordinates][1]`: -0.0917
   - `location[address]`: (text)
   - `priority`: (text)
   - `images`: (file) - Select multiple images

---

## 🌐 Deployment

### Deploy to Render

1. **Create Render Account**
   - Sign up at [Render.com](https://render.com)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Build Settings**
   ```
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   - Go to "Environment" tab
   - Add all variables from `.env`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Deploy to Railway

1. Sign up at [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables
5. Deploy

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add MongoDB addon (or use Atlas)
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set CLOUDINARY_NAME=your_cloud_name
# ... add all other variables

# Deploy
git push heroku main
```

---

## 🐛 Common Issues

### Issue: MongoDB Connection Failed
**Solution:** 
- Check MongoDB URI is correct
- Whitelist your IP in MongoDB Atlas
- Ensure database user has correct permissions

### Issue: Cloudinary Upload Failed
**Solution:**
- Verify Cloudinary credentials
- Check uploads folder exists and has write permissions
- Ensure file size is under 5MB

### Issue: JWT Token Invalid
**Solution:**
- Check JWT_SECRET matches in .env
- Verify token format: "Bearer <token>"
- Token might be expired (30 days)

### Issue: CORS Error
**Solution:**
- Add your frontend URL to CLIENT_URL in .env
- Server automatically enables CORS

---

## 📝 Notes

- Images are automatically deleted from Cloudinary when reports are deleted
- Local uploaded files are deleted after Cloudinary upload
- Geospatial queries use MongoDB's 2dsphere index
- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 30 days

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Anthropic's Claude AI for assistance
- MongoDB for database
- Cloudinary for image storage
- Express.js community
- SDG 11: Sustainable Cities and Communities

---

## 🚀 Next Steps

After setting up the backend:

1. Test all API endpoints using Postman
2. Setup the frontend React application
3. Connect frontend to backend API
4. Deploy both frontend and backend
5. Setup monitoring and logging
6. Add email notifications (optional)
7. Implement real-time updates with Socket.io (optional)

---

## 📞 Support

If you encounter any issues:
1. Check this README
2. Review API documentation
3. Check server logs
4. Open an issue on GitHub

---

**Happy Coding! 🎉**