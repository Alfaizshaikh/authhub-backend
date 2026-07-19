const request = require('supertest');
const express = require('express');
const postRoutes = require('../routes/postRoutes');
const errorHandler = require('../middleware/errorHandler');

// Mock your centralized database configuration
jest.mock('../config/db', () => ({
    query: jest.fn()
}));

const db = require('../config/db');

// Mock verifyToken to easily simulate authenticated users
jest.mock('../middleware/verifyToken', () => {
    return (req, res, next) => {
        req.user = { id: 1, role: 'user', email: 'test@user.com' }; // Default mock user
        next();
    };
});

// Setup a minimal express app specifically for testing post architecture
const app = express();
app.use(express.json());
app.use('/api', postRoutes);
app.use(errorHandler);

describe('Post API Endpoints', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/posts', () => {
        it('should return 400 if title or content is missing', async () => {
            // Mock subscription validation response (Free plan, 5 post limit)
            db.query.mockResolvedValueOnce([[{ plan: 'free', post_limit: 5, status: 'active' }]]);
            // Mock current post count query
            db.query.mockResolvedValueOnce([[{ postCount: 2 }]]);

            const res = await request(app)
                .post('/api/posts')
                .send({ title: '' }); // Content & title invalid
            
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Title and content required');
        });

        it('should return 403 if free user has reached their post limit', async () => {
            // Mock subscription validation response (Free plan, 5 post limit)
            db.query.mockResolvedValueOnce([[{ plan: 'free', post_limit: 5, status: 'active' }]]);
            // Mock current post count showing the user already hit their ceiling of 5
            db.query.mockResolvedValueOnce([[{ postCount: 5 }]]);

            const res = await request(app)
                .post('/api/posts')
                .send({ title: 'New Story', content: 'Some pristine content.' });
            
            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe('Free post limit reached. Upgrade to premium.');
        });

        it('should return 201 and successfully create a post if within limits', async () => {
            db.query.mockResolvedValueOnce([[{ plan: 'free', post_limit: 5, status: 'active' }]]);
            db.query.mockResolvedValueOnce([[{ postCount: 1 }]]); // Well under the limit
            db.query.mockResolvedValueOnce([]); // Mock successful insert execution

            const res = await request(app)
                .post('/api/posts')
                .send({ title: 'Optimized App', content: 'Clean code wins.' });
            
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Post created successfully');
        });
    });
});