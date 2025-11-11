const Application = require('../model/Application');
const { successResponse, errorResponse } = require('../utils/response');

exports.createApplication = async (req, res) => {
    try {
        const {
            applicationType,
            customerInfo,
            vehicle,
            loan,
            tradeInDetails,
            notes
        } = req.body;

        const application = await Application.create({
            applicationType,
            customerInfo,
            vehicle: {
                type: applicationType === 'trade-in' ? 'trade-in' : 'new',
                brand: vehicle.brand,
                newCar: vehicle.newCar,
                tradeIn: applicationType === 'trade-in' ? vehicle.tradeIn : null
            },
            loan,
            tradeInDetails: applicationType === 'trade-in' ? tradeInDetails : null,
            salesPerson: req.user.id,
            notes,
            status: 'submitted'
        });

        res.status(201).json(
            successResponse('Application submitted successfully', {
                application: {
                    id: application._id,
                    applicationId: application.applicationId,
                    applicationType: application.applicationType,
                    customerInfo: application.customerInfo,
                    vehicle: application.vehicle,
                    loan: application.loan,
                    status: application.status,
                    applicationDate: application.applicationDate
                }
            })
        );
    } catch (error) {
        console.error('Create application error:', error);

        if (error.code === 11000) {
            return res.status(400).json(
                errorResponse('Application ID already exists')
            );
        }

        res.status(500).json(
            errorResponse('Server error during application creation')
        );

    }
};

exports.getApplications = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            applicationType,
            search,
            sortBy = 'applicationDate',
            sortOrder = 'desc'
        } = req.query;

        const query = {};

        //Filter by status
        if (status && status !== 'all') {
            query.status = status;
        }

        //Filter by application type
        if (applicationType && applicationType !== 'all') {
            query.applicationType = applicationType;
        }

        // Search by customer name, phone, or application ID
        if (search) {
            query.$or = [
                { 'customerInfo.firstname': { $regex: search, $options: 'i' } },
                { 'customerInfo.lastName': { $regex: search, $options: 'i' } },
                { 'customerInfo.phone': { $regex: search, $options: 'i' } },
                { 'customerInfo.email': { $regex: search, $options: 'i' } },
                { applicationId: { $regex: search, $options: 'i' } }
            ];
        }

        //For sales user, only show their applications
        if (req.user.role === 'sales') {
            query.salesPerson = req.user.id;
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const applications = await Application.find(query)
            .populate('salesPerson', 'name email')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Application.countDocuments(query);

        res.json(
            successResponse('Application retrieved successfully', {
                applications,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalApplications: total,
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            })
        );
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json(
            errorResponse('Error fetching applications')
        );
    }
};