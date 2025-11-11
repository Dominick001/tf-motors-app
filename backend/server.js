const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
connectDB();

const Application = require('./model/Application');

const { helmetConfig, limiter, corsConfig } = require('./middleware/security');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const applicationRoutes = require('./routes/applications');

const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmetConfig);
app.use(limiter);
app.use(cors(corsConfig));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));

} else {
    app.use(morgan('combined'));
}

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'TF Motors API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});


app.get('/api/application/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('salesPerson', 'name email')
            .populate('reviewedBy', 'name email');

        if (!application) {
            return res.status(404).json({
                status: 'error',
                message: 'Application not found'
            });
        }

        res.json({
            status: 'success',
            data: { application }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);

app.use(errorHandler);

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

});

process.on('unhandledRejection', (err, promise) => {
    console.log('Unhandle Rejection at:', promise, 'reason:', err);
    server.close(() => {
        process.exit(1);
    });
});

//Testing
app.get('/api/debug/db', async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        const appCount = await Application.countDocuments({});

        res.json({
            database: {
                state: states[dbState],
                connected: dbState === 1
            },
            collections: collectionNames,
            applications: {
                count: appCount,
                exists: collectionNames.includes('applications')
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;