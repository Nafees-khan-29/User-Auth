import express, { Router } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/mongodbConnection.js';
import userAuth from './middleware/userAuth.js';
import userRouter from './route/userRouters.js';
import authRouter from './route/authRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS: Origin not allowed'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 200
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
 // Add this AFTER cors middleware but BEFORE routes

// Constants
const port = process.env.PORT || 5000;

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Server is running',
        port: port 
    });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Create async function to start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();
        console.log('Database connected successfully');

        // Start server after DB connection
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

// Call the async function
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});