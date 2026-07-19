const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const errorHandler = require('../middleware/errorHandler');

// Mock the database pool to prevent actual database writes during tests
jest.mock('../config/db', () => ({
    query: jest.fn()
}));

const db = require('../config/db');

// Setup a minimal express app for testing the route
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Auth API Endpoints', () => {
    
    beforeEach(() => {
        jest.clearAllMocks(); // Reset DB mocks before each test
    });

    describe('POST /api/auth/register', () => {
        it('should return 400 if email is invalid', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'invalid-email',
                    password: 'password123'
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Please provide a valid email address');
        });
        it('should return 201 on successful registration', async () => {
            // FIXED: Mock the DB returning an empty array (meaning 0 users exist)
            db.query.mockResolvedValueOnce([[]]); 
            
            // Mock the successful insert
            db.query.mockResolvedValueOnce([{ insertId: 1 }]); 
            // Mock the subscription creation
            db.query.mockResolvedValueOnce([]); 

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('User registered successfully');
        });
    });
});