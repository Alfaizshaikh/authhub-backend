# Role Based Authentication System

A backend authentication system built using **Node.js, Express.js, and MySQL**.
This project implements secure user authentication and role-based authorization using **JWT tokens**, **bcrypt password hashing**, and middleware-based access control.

---

# Features

- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected routes
- Role-based access control (RBAC)
- User profile API
- Admin user management
- Promote user role
- Delete user
- MySQL database integration
- Input validation middleware
- Global error handling middleware

---

# Tech Stack

## Backend

- Node.js
- Express.js

## Database

- MySQL

## Security

- bcrypt
- JSON Web Token (JWT)

## Tools

- VS Code REST Client
- XAMPP MySQL

---

# Installation

## 1. Clone Repository

```bash
git clone your-repository-link
```

## 2. Navigate to Project

```bash
cd project_name
```

## 3. Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=your_dbname

JWT_SECRET=your_secret_key
```

---

# Run Application

Start the server:

```bash
node server.js
```

Expected output:

```text
Server running on 3000
MySQL Connected
```

---

# API Endpoints

## Authentication

### Register User

```http
POST /auth/register
```

### Login User

```http
POST /auth/login
```

---

## User

### Get Profile

```http
GET /profile
```

Requires:

```http
Authorization: Bearer TOKEN
```

---

## Admin

### Get All Users

```http
GET /users
```

Admin access required.

---

### Update User Role

```http
PATCH /users/:id/role
```

Example body:

```json
{
    "role":"admin"
}
```

---

### Delete User

```http
DELETE /users/:id
```

Admin access required.

---

# Project Structure

```
node-auth/

│
├── config/
│
├── controllers/
│
├── middleware/
│
├── models/
│
├── routes/
│
├── validators/
│
├── api-tests/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

---

# Testing APIs

This project uses **VS Code REST Client** for API testing.

API request files are available inside:

```
api-tests/
```

Available tests:

```
register.http
login.http
profile.http
admin.http
```

---

# Security Practices Implemented

- Passwords are never stored in plain text
- Password hashing using bcrypt
- JWT token authentication
- Role-based route protection
- Environment variables for sensitive information
- SQL injection protection using parameterized queries
