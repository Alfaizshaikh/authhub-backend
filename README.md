````markdown
# Secure Auth & Community API

A production-ready backend REST API built using **Node.js, Express.js, and MySQL**.

This project serves as the backend for a decoupled developer community platform. It provides secure user authentication, role-based authorization, protected file uploads, and enterprise-grade security practices suitable for real-world deployment.

---

# 🚀 Key Features

- **Secure Authentication**
  - User registration and login using **bcrypt** password hashing and **JWT (JSON Web Tokens)**.

- **Role-Based Access Control (RBAC)**
  - Separate permissions for **User** and **Admin** roles.

- **Community Posts**
  - Create, view, and delete posts.
  - Supports image uploads with each post.

- **Secure File Uploads**
  - Image validation using **Multer**.
  - MIME-type verification.
  - Filename sanitization.
  - Upload restrictions for improved security.

- **Enterprise-Level Security**
  - Secure HTTP headers using **Helmet.js**.
  - Cross-Origin Resource Sharing (CORS).
  - Express Rate Limiting to prevent brute-force attacks and abuse.

- **Database Optimization**
  - MySQL2 Promise API.
  - Connection Pooling for efficient concurrent database access.

- **Automated Testing**
  - API testing using **Jest** and **Supertest**.
  - Continuous Integration with **GitHub Actions**.

---

# 🛠️ Tech Stack

## Backend
- Node.js
- Express.js

## Database
- MySQL
- mysql2 (Promise Wrapper)

## Security
- bcryptjs
- jsonwebtoken
- helmet
- express-rate-limit
- cors

## File Upload
- multer

## Testing
- Jest
- Supertest

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/node-auth.git
cd node-auth
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=node_auth

JWT_SECRET=your_super_secret_64_character_string

MAX_POSTS=25
```

---

## 4. Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE node_auth;
```

2. Import the required database tables:

- users
- posts

---

## 5. Run the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

---

# 🌐 API Endpoints

> **Note:** Protected endpoints require a valid JWT.

```
Authorization: Bearer <token>
```

---

## Authentication

Base Route:

```
/api/auth
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and receive JWT |
| GET | `/profile` | Get logged-in user profile *(Protected)* |

---

## Community Posts

Base Route:

```
/api/posts
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Get all community posts |
| GET | `/my-posts` | Get logged-in user's posts *(Protected)* |
| POST | `/` | Create a post with image *(Protected)* |
| DELETE | `/:id` | Delete a post *(Protected)* |

---

## Admin Routes

Base Route:

```
/api/admin
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/users` | Get all users *(Admin Only)* |
| PATCH | `/users/:id/role` | Update user role *(Admin Only)* |
| DELETE | `/users/:id` | Delete user *(Admin Only)* |

---

# 🧪 Automated Testing

Run the complete Jest test suite.

```bash
npm test
```

The test suite covers:

- Authentication
- Authorization
- JWT validation
- Protected routes
- Error handling
- API endpoint responses

---

# 🔒 Security Practices

### Password Security

- Passwords are never stored in plain text.
- Salted and hashed using **bcrypt**.

---

### Stateless Authentication

- Authentication handled entirely using **JWT**.
- No server-side sessions.

---

### SQL Injection Protection

- All database queries use **parameterized statements** with `mysql2/promise`.

---

### Rate Limiting

- Global API rate limiting.
- Protection against brute-force login attempts.
- Helps mitigate DDoS attacks.

---

### HTTP Security Headers

Implemented using **Helmet.js**, including protection for:

- XSS
- Clickjacking
- MIME sniffing
- CORB
- COEP

---

### CORS Protection

Cross-Origin Resource Sharing is configured to allow only trusted origins.

---

### Secure File Uploads

Uploads are protected through:

- MIME type validation
- File extension validation
- Filename sanitization
- Restricted upload directory

---

# 📂 Project Structure

```
node-auth/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── uploads/
├── tests/
├── utils/
├── .env
├── app.js
├── server.js
├── package.json
└── README.md
```

---
# 📄 About This Project

This is a personal portfolio project built to demonstrate modern backend development practices and real-world API architecture. It focuses on security, scalability, maintainability, and clean code principles using **Node.js, Express.js, and MySQL**.

The project will be deployed publicly and maintained as part of my software development portfolio. Feedback, suggestions, and contributions are always welcome.
````

