# 🔌 Smart Waste Management API Documentation

Base URL: `http://localhost:5000/api`

## 📑 Table of Contents
- [Authentication](#authentication)
- [User Routes](#user-routes)
- [Report Routes](#report-routes)
- [Schedule Routes](#schedule-routes)
- [Admin Routes](#admin-routes)

---

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 👤 User Routes

### Register User
**POST** `/users/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Kisumu",
    "state": "Kisumu County",
    "zipCode": "40100"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login User
**POST** `/users/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get User Profile
**GET** `/users/profile` 🔒

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "Kisumu",
      "state": "Kisumu County",
      "zipCode": "40100"
    },
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update User Profile
**PUT** `/users/profile` 🔒

**Body:**
```json
{
  "name": "John Updated",
  "phone": "+0987654321",
  "password": "newpassword123"
}
```

**Response:** `200 OK`

---

## 📝 Report Routes

### Create Report
**POST** `/reports` 🔒

**Content-Type:** `multipart/form-data`

**Body:**
```
title: "Overflowing garbage bin"
description: "The bin at Main Street is overflowing for 3 days"
category: "overflow"
location[coordinates][0]: 34.7519
location[coordinates][1]: -0.0917
location[address]: "Main Street, Kisumu"
priority: "high"
images: [file1.jpg, file2.jpg]
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "user": "64f5a1b2c3d4e5f6g7h8i9j0",
    "title": "Overflowing garbage bin",
    "description": "The bin at Main Street is overflowing for 3 days",
    "category": "overflow",
    "location": {
      "type": "Point",
      "coordinates": [34.7519, -0.0917],
      "address": "Main Street, Kisumu"
    },
    "images": [
      {
        "url": "https://res.cloudinary.com/...",
        "publicId": "waste-management/..."
      }
    ],
    "status": "pending",
    "priority": "high",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Categories:** `uncollected`, `illegal_dumping`, `overflow`, `damaged_bin`, `other`

**Priority:** `low`, `medium`, `high`, `urgent`

---

### Get All Reports
**GET** `/reports` 🔒

**Query Parameters:**
- `status`: pending | in_progress | resolved | rejected
- `category`: uncollected | illegal_dumping | overflow | damaged_bin | other
- `priority`: low | medium | high | urgent
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Example:**
```
GET /reports?status=pending&category=overflow&page=1&limit=10
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "user": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "title": "Overflowing garbage bin",
      "status": "pending",
      "priority": "high",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### Get Single Report
**GET** `/reports/:id` 🔒

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "user": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": {...}
    },
    "title": "Overflowing garbage bin",
    "description": "The bin at Main Street is overflowing for 3 days",
    "category": "overflow",
    "location": {
      "type": "Point",
      "coordinates": [34.7519, -0.0917],
      "address": "Main Street, Kisumu"
    },
    "images": [...],
    "status": "pending",
    "priority": "high",
    "assignedTo": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get Nearby Reports
**GET** `/reports/nearby` 🔒

**Query Parameters:**
- `longitude`: Longitude coordinate (required)
- `latitude`: Latitude coordinate (required)
- `distance`: Distance in kilometers (default: 5)

**Example:**
```
GET /reports/nearby?longitude=34.7519&latitude=-0.0917&distance=10
```

**Response:** `200 OK`

---

### Update Report
**PUT** `/reports/:id` 🔒

**Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "urgent"
}
```

**Response:** `200 OK`

---

### Delete Report
**DELETE** `/reports/:id` 🔒

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

---

## 📅 Schedule Routes

### Get All Schedules
**GET** `/schedules`

**Query Parameters:**
- `area`: Filter by area name
- `wasteType`: general | recyclable | organic | hazardous
- `isActive`: true | false

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "area": "Downtown Kisumu",
      "wasteType": "general",
      "days": ["Monday", "Thursday"],
      "time": "07:00 AM",
      "route": "Route A",
      "isActive": true,
      "createdBy": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
        "name": "Admin User"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 15
}
```

---

### Get Today's Schedules
**GET** `/schedules/today`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [...],
  "day": "Monday",
  "count": 5
}
```

---

### Create Schedule
**POST** `/schedules` 🔒 👑

**Body:**
```json
{
  "area": "Downtown Kisumu",
  "wasteType": "general",
  "days": ["Monday", "Thursday"],
  "time": "07:00 AM",
  "route": "Route A"
}
```

**Response:** `201 Created`

---

### Update Schedule
**PUT** `/schedules/:id` 🔒 👑

**Response:** `200 OK`

---

### Delete Schedule
**DELETE** `/schedules/:id` 🔒 👑

**Response:** `200 OK`

---

## 👑 Admin Routes

All admin routes require admin role.

### Get Dashboard Statistics
**GET** `/admin/stats` 🔒 👑

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalReports": 150,
      "pendingReports": 35,
      "inProgressReports": 20,
      "resolvedReports": 90,
      "rejectedReports": 5,
      "totalUsers": 500,
      "totalWorkers": 15
    },
    "reportsByCategory": [
      { "_id": "overflow", "count": 45 },
      { "_id": "uncollected", "count": 60 },
      { "_id": "illegal_dumping", "count": 25 }
    ],
    "reportsByPriority": [
      { "_id": "high", "count": 30 },
      { "_id": "medium", "count": 80 },
      { "_id": "low", "count": 40 }
    ],
    "recentReports": [...]
  }
}
```

---

### Update Report Status
**PUT** `/admin/reports/:id/status` 🔒 👑

**Body:**
```json
{
  "status": "resolved",
  "adminNotes": "Issue resolved by cleaning team",
  "assignedTo": "64f5a1b2c3d4e5f6g7h8i9j0"
}
```

**Response:** `200 OK`

---

### Assign Report to Worker
**PUT** `/admin/reports/:id/assign` 🔒 👑

**Body:**
```json
{
  "workerId": "64f5a1b2c3d4e5f6g7h8i9j0"
}
```

**Response:** `200 OK`

---

### Get All Users
**GET** `/admin/users` 🔒 👑

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [...],
  "count": 500
}
```

---

### Update User Role
**PUT** `/admin/users/:id/role` 🔒 👑

**Body:**
```json
{
  "role": "worker"
}
```

**Roles:** `user`, `worker`, `admin`

**Response:** `200 OK`

---

### Delete User
**DELETE** `/admin/users/:id` 🔒 👑

**Response:** `200 OK`

---

## 🚨 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "stack": "Error stack trace (only in development)"
}
```

### Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 📝 Notes

- 🔒 = Requires authentication
- 👑 = Requires admin role
- All dates are in ISO 8601 format
- Coordinates format: `[longitude, latitude]`
- Image uploads limited to 5 files, 5MB each
- Supported image formats: JPEG, JPG, PNG, GIF