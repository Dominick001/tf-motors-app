const express = require('express');
const Application = require('../model/Application');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'sales') {
            query.salesPerson = req.user.id;
        }

        if (req.query.salesPerson && req.query.salesPerson !== 'all' &&
            (req.user.role === 'manager' || req.user.role === 'admin')) {
            query.salesPerson = req.query.salesPerson;
        }
        // Salesperson filter for managers/admins
        if (req.query.salesPerson && req.query.salesPerson !== 'all' &&
            (req.user.role === 'manager' || req.user.role === 'admin')) {
            query.salesPerson = req.query.salesPerson;
        }


        if (req.query.time && req.query.time !== 'all') {
            let startDate = new Date();

            if (req.query.time === 'week') {
                startDate.setDate(startDate.getDate() - 7);
            } else if (req.query.time === 'month') {
                startDate.setMonth(startDate.getMonth() - 1);
            }

            query.createdAt = { $gte: startDate };
        }

        if (req.query.status && req.query.status !== 'all') {
            query.status = req.query.status;
        }

        const applications = await Application.find(query)
            .populate('salesPerson', 'name email')
            .populate('reviewedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: applications.length,
            data: { applications }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }

});

router.get('/dashboard/stats', async (req, res) => {
    try {
        console.log('GET /api/applications/dashboard/stats called by user:', req.user.id, req.user.role);

        let query = {};

        if (req.user.role === 'sales') {
            query.salesPerson = req.user.id;
        }

        if (req.query.salesPerson && req.query.salesPerson !== 'all' &&
            (req.user.role === 'manager' || req.user.role === 'admin')) {
            query.salesPerson = req.query.salesPerson;
        }

        if (req.query.time && req.query.time !== 'all') {
            let startDate = new Date();

            if (req.query.time === 'week') {
                startDate.setDate(startDate.getDate() - 7);
            } else if (req.query.time === 'month') {
                startDate.setMonth(startDate.getMonth() - 1);
            }
            query.createdAt = { $gte: startDate };
        }
       

        // Get counts for different statuses
        const totalApplications = await Application.countDocuments(query);
        

        // Get application type counts
        const newCarApplications = await Application.countDocuments({ ...query, applicationType: 'new-car' });
        const tradeInApplications = await Application.countDocuments({ ...query, applicationType: 'trade-in' });

        // Get total loan amount
        const loanStats = await Application.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalLoanAmount: { $sum: '$loan.loanAmount' }
                }
            }
        ]);

        const totalLoanAmount = loanStats[0]?.totalLoanAmount || 0;

        res.status(200).json({
            status: 'success',
            data: {
                overview: {
                    totalApplications,
                    submittedApplications,
                    approvedApplications,
                    rejectedApplications,
                    underReviewApplications,
                    draftApplications,
                    totalLoanAmount,
                    newCarApplications,
                    tradeInApplications
                }
            }
        });

    } catch (error) {
        console.error('GET /api/applications/dashboard/stats ERROR:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', async (req, res) => {
    try {
        console.log('==Creating Application==');
        console.log('Requested body:', JSON.stringify(req.body, null, 2));
        const generateApplicationId = () => {
            const prefix = req.body.applicationType === 'trade-in' ? 'TF-TI' : 'TF-NC';
            const year = new Date().getFullYear();
            const random = Math.floor(1000 + Math.random() * 9000);
            return `${prefix}-${year}-${random}`;
        };
    
    
        const applicationData = {
            ...req.body,
            salesPerson: req.user.id,
            applicationId: generateApplicationId(),
            status: 'submitted'
        };

        
        const application = await Application.create(applicationData);
      

        res.status(201).json({
            status: 'success',
            data: { application }
        });
    } catch (error) {
    
        if (error.name === 'ValidationError') {
            console.error('VALIDATION ERRORS:');
            Object.keys(error.errors).forEach(field => {
                console.error(`- ${field}:`, error.errors[field].message);
            });

            return res.status(400).json({
                status: 'error',
                message: 'Application validation failed',
                errors: Object.keys(error.errors).reduce((acc, key) => {
                    acc[key] = error.errors[key].message;
                    return acc;
                }, {})
            });
        }

        
        if (error.name === 'CastError') {
            console.error('CAST ERROR:', error);
            return res.status(400).json({
                status: 'error',
                message: `Invalid data format for field: ${error.path}`
            });
        }

        console.error('Full error stack:', error.stack);

        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ status: 'error', message: 'Loan not found' });
        }

        if (req.user.role === 'sales' &&
            (application.salesPerson.toString() !== req.user.id || application.status !== 'draft')) {
            return res.status(403).json({ status: 'error', message: 'Not your draft!' });
        }
        const updated = await Application.findByIdAndUpdate(
            req.params.id, req.body,
            { new: true, runValidators: true }
        ).populate('salesPerson', 'name email')
            .populate('reviewedBy', 'name email');

        res.status(200).json({
            status: 'success', data: {
                application: updated
            }
        });

    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.patch('/:id/submit', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) return res.status(404).json({ status: 'error', message: 'Not found' });
        if (application.salesPerson.toString() !== req.user.id) {
            return res.status(403).json({ status: 'error', message: 'Not yours!' });
        }

        application.status = 'submitted';
        await application.save();

        const updatedApplication = await Application.findById(req.params.id)
            .populate('salesPerson', 'name email')
            .populate('reviewedBy', 'name email');

        res.status(200).json({ status: 'success', data: { application: updatedApplication } });

    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.patch('/:id/review', async (req, res) => {
    try {
        if (req.user.role !== 'manager') {
            return res.status(403).json({ status: 'error', message: 'Boss Only!' });
        }

        const { action, notes } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) return res.status(404).json({ status: 'error', message: 'Not found' });

        application.status = action;
        application.reviewedBy = req.user.id;
        application.reviewNotes = notes;
        application.reviewDate = new Date();
        await application.save();

        res.status(200).json({ status: 'success', data: { application } });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});


module.exports = router;