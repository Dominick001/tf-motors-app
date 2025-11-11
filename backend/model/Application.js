const mongoose = require('mongoose');
const loanDetailsSchema = new mongoose.Schema({
    loanAmount: {
        type: Number,
        required: true,
        min: [0, 'Loan amount cannot be negative']
    },

    downPayment: {
        type: Number,
        required: true,
        min: [0, 'Down payment cannot be negative']
    },

    downPaymentRatio: {
        type: Number,
        required: true,
        min: [0, 'Down payment ratio cannot be negative'],
        max: [100, 'Down payment ratio cannot exceed 100%']
    },

    interestRate: {
        type: Number,
        required: true,
        min: [1, 'Interest Rate cannot be negative']

    },

    loanTerm: {
        type: Number,
        required: true,
        min: [1, 'Loan term must be at least 1 month']
    },

    monthlyPayment: {
        type: Number,
        required: true,
        min: [0, 'Monthly payment cannot be negative']
    },

    totalInterest: {
        type: Number,
        required: true,
        min: [0, 'Total interest cannot be negative']
    },

    totalCost: {
        type: Number,
        required: true,
        min: [0, 'Total cost cannot be negative']
    },

    amortizationSchedule: [{
        month: Number,
        payment: Number,
        principal: Number,
        interest: Number,
        remainingBalance: Number
    }]
});

const newCarSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    brand: {
        type: String,
        required: true,
        trim: true
    }
});

const tradeInVehicleSchema = new mongoose.Schema({
    year: {
        type: Number
    },
    make: {
        type: String,
        trim: true
    },
    model: {
        type: String,
        trim: true
    },
    estimatedValue: {
        type: Number,
        default: 0,
        min: [0, 'Estimated value cannot be negative']
    },
    manualValue: {
        type: Number,
        default: 0,
        min: [0, 'Manual value cannot be negative']
    },
    valueSource: {
        type: String,
        enum: ['table', 'manual', ''],
        default: ''
    },
    netValue: {
        type: Number,
        default: 0
    }
});

const vehicleSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['new', 'trade-in'],
        required: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    newCar: {
        type: newCarSchema,
        required: true
    },
    tradeIn: {
        type: tradeInVehicleSchema,
        default: null
    }
});

const customerInfoSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: [50, 'First name cannot be more than 50 characters']
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: [50, 'Last name cannot be more than 50 characters']
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },

});

const applicationSchema = new mongoose.Schema({
    applicationId: {
        type: String,
        required: true,
        unique: true
    },
    applicationType: {
        type: String,
        enum: ['new-car', 'trade-in'],
        required: true
    },
    customerInfo: {
        type: customerInfoSchema,
        required: true
    },
    vehicle: {
        type: {
            type: String,
            enum: ['new', 'trade-in'],
            required: true
    },
    brand: {
        type: String,
        required: true
    },
    newCar: {
        model: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        brand: {
            type: String,
            required: true
        }
    },
    tradeIn: {
        year: Number,
        make: String,
        model: String,
        estimatedValue: Number,
        netValue: Number,
        valueSource: String
    }
},
    loan: {
        type: loanDetailsSchema,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
        default: 'submitted'
    },
    salesPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewNotes: {
        type: String
    },
    reviewDate: {
        type: Date
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    firstPaymentDate: {
        type: Date
    },
    notes: {
        type: String
    },
    pdfGenerated: {
        type: Boolean,
        default: false
    },
    tradeInDetails: {
        selectedBrand: String,
        selectedModel: String,
        selectedYear: Number,
        valueSource: String
    }
}, {
    timestamps: true

});

applicationSchema.pre('save', function (next) {
    if (!this.applicationId) {
        const prefix = this.applicationType === 'trade-in' ? 'TF-TI' : 'TF-NC';
        const year = new Date().getFullYear();
        const random = Math.floor(1000 + Math.random() * 9000);
        this.applicationId = `${prefix}-${year}-${random}`;

    }

    if (!this.firstPaymentDate) {
        const firstPayment = new Date();
        firstPayment.setMonth(firstPayment.getMonth() + 1);
        this.firstPaymentDate = firstPayment;
    }
    next();
});

module.exports = mongoose.model('Application', applicationSchema);