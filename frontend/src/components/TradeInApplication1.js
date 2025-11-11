import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TradeInApplication = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showMonthlyPayments, setShowMonthlyPayments] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState('MG')
    const [selectedTradeInBrand, setSelectedTradeInBrand] = useState('MG');


    const [application, setApplication] = useState({
        vehicle: {
            type: 'trade-in',
            brand: 'MG',
            newCar: {
                model: 'MG ZS 2025',
                price: 26500,
                color: 'White'
            },
            tradeIn: {
                year: new Date().getFullYear() - 3,
                make: 'MG',
                model: 'ZS',
                mileage: 45000,
                condition: 'good',
                estimatedValue: 0,
                netValue: 0
            },
        },
        loan: {
            loanAmount: 0,
            downPayment: 5300,
            downPaymentRatio: 20,
            interestRate: 5.5,
            loanTerm: 60,
            monthlyPayment: 0,
            totalInterest: 0,
            totalCost: 0,
            amortizationSchedule: []
        }
    });

    const vehicleBrands = {
        MG: [
            { id: 'mg-zs', name: 'MG ZS 2025', price: 26000, features: '1.5L Engine,8 Speeds Automatic, 448 L Truck Capacity', image: '/images/cars/MGZsWhite.png' },
            { id: 'mg-gt', name: 'MG GT Del 2025', price: 29990, features: 'Sedan, 1.5L Turbo', image: '/images/cars/MG-GT-Black.png' },
            { id: 'mg-rx5', name: 'MG RX5 Lux Reborn Sport Edition 2025', price: 35999, features: 'SUV, 1.5L Turbo', image: '/images/cars/MG-Rx5.png' },
            { id: 'mg-7-lst', name: 'MG 7 1.5 2025', price: 39990, features: 'Sedan, 1.5L Turbo', image: '/images/cars/MG-7-White.png' },
            { id: 'mg-7-2t', name: 'MG 7 2.0 2025', price: 49990, features: 'Sedan, 2.0L Turbo', image: '/images/cars/MG-7-Red.png' },
            { id: 'mg-rx8', name: 'MG RX8', price: 47990, features: 'Suv, 2.0L', image: '/images/cars/MG-RX8.png' },
            { id: 'mg-rx9', name: 'MG RX9 Beige Interior', price: 53990, features: 'SUV, 2.0L Turbo', image: '/images/cars/Rx9White.png' },
            { id: 'mg-cyberster', name: 'MG Cyberster 2025', price: 79990, features: 'Sports Car, Electric', image: '/images/cars/MG_Cyberster.png' },
            { id: 'mg-4', name: 'MG4 Electric', price: 38990, features: 'Electric Car', image: '/images/cars/MG4-White.png' },
            { id: 'mg-marvel-r', name: 'MG Marvel R', price: 45990, features: 'Electric SUV', image: '/images/cars/MG-MARVEL-R.png' },
            { id: 'mg-hs-1.5', name: 'MG HS 1.5 DEL', price: 37990, features: 'Suv', image: '/images/cars/MG-HS-Black.png' },
            { id: 'mg-hs-1.5-lux', name: 'MG HS 1.5 Lux Hybrid', price: 42990, features: 'Suv', image: '/images/cars/MG-Hs-hybrid.png' },
            { id: 'mg-g50', name: 'MG G50 8 seater', price: 34500, features: 'Suv', image: '/images/cars/G50-New.png' }

        ],
        Maxus: [
            { id: 'maxus-v80', name: 'Maxus V80 2022', price: 27990, features: 'Suv', image: '/images/cars/Maxusv80.png' },
            { id: 'maxus-mifa', name: 'Maxus Mifa 9 2024', price: 65990, features: 'Suv', image: '/images/cars/MaxusMifa9.png' },
            { id: 'maxus-d60', name: 'Maxus D60', price: 34990, features: 'Suv', image: '/images/cars/MaxusD60.png' },
            { id: 'maxus-d60-black-kit', name: 'Maxus D60 Black Kit', price: 35990, features: 'Suv', image: '/images/cars/Maxus-D60-Black.png' },
            { id: 'maxus-mifa7', name: 'Maxus Mifa 7', price: 51990, features: 'SUV', image: '/images/cars/MaxusMifa7.png' },
            { id: 'maxus-g90', name: 'Maxus G90', price: 53990, features: 'Suv', image: '/images/cars/Maxus-G90.png' }

        ],
        LeapMotor: [
            { id: 'leapmotor-t03', name: 'Leap Motor T03 EV', price: 14990, features: 'Suv', image: '/images/cars/T03.png' },
            { id: 'leapmotor-c10', name: 'Leap Motor C10 EV', price: 32990, features: 'Suv', image: '/images/cars/C10.png' }
        ]
    };

    {/* Trade-in Model */ }

    const tradeInModels = {
        MG: ['ZS', 'GT', 'RX5', 'MG 7', 'RX9', 'Cyberster', 'MG3', 'MG5', 'MG6', 'HS', 'Marvel R', 'MG4', 'G50'],
        Maxus: ['V80', 'Mifa 9', 'D60', 'Mifa 7', 'G90', 'T60', 'T70', 'G10', 'G20'],
        LeapMotor: ['T03', 'C10']
    };

    {/* Trade-in BaseValue */ }
    const tradeInBaseValues = {
        MG: {
            'ZS': 16000, 'GT': 18000, 'RX5': 20000, 'MG 7': 23000,
            'RX9': 30000, 'Cyberster': 40000, 'MG3': 10000,
            'MG5': 13000, 'MG6': 15000, 'HS': 18000, 'Marvel R': 25000,
            'MG4': 22000, 'G50': 14000
        },
        Maxus: {
            'V80': 18000, 'Mifa 9': 45000, 'D60': 22000, 'Mifa 7': 35000,
            'G90': 38000, 'T60': 20000, 'T70': 23000, 'G10': 25000, 'G20': 28000
        },
        LeapMotor: {
            'T03': 8000, 'C10': 20000
        }
    };

    const handleTradeInBrandChange = (brand) => {
        setSelectedTradeInBrand(brand);
        setApplication(prev => ({
            ...prev,
            vehicle: {
                ...prev.vehicle,
                tradeIn: {
                    ...prev.vehicle.tradeIn,
                    brand: brand,
                    model: tradeInModels[brand][0] || ''
                }
            }
        }));
    };


    const handleBrandChange = (brand) => {
        setSelectedBrand(brand);
        const firstModel = vehicleBrands[brand][0];
        handleVehicleSelect(firstModel, brand);
    }

    const handleInputChange = (section, field, value) => {
        setApplication(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleNestedInputChange = (mainSection, subSection, field, value) => {
        setApplication(prev => ({
            ...prev,
            [mainSection]: {
                ...prev[mainSection],
                [subSection]: {
                    ...prev[mainSection][subSection],
                    [field]: value
                }
            }
        }));
    };

    const handleVehicleSelect = (model) => {
        setApplication(prev => ({
            ...prev,
            vehicle: {
                ...prev.vehicle,
                newCar: {
                    model: model.name,
                    price: model.price,
                    color: 'White'
                }
            }
        }));
        calculateLoan(model.price);
    };

    {/* Monthly Payment Table */ }
    const generateAmortizationSchedule = (loanAmount, monthlyRate, monthlyPayment, term) => {
        const schedule = [];
        let balance = parseFloat(loanAmount.toFixed(2));

        for (let month = 1; month <= term; month++) {
            const interestPayment = parseFloat((balance * monthlyRate).toFixed(2));
            let principalPayment = parseFloat((monthlyPayment - interestPayment).toFixed(2));

                if (month === term || principalPayment > balance) {
                    principalPayment = parseFloat(balance.toFixed(2));
                }

                const endingBalance = parseFloat(Math.max(0, balance - principalPayment).toFixed(2));
                const actualPayment = parseFloat((principalPayment + interestPayment).toFixed(2));


                schedule.push({
                    month,
                    payment: actualPayment,
                    principal: principalPayment,
                    interest: interestPayment,
                    remainingBalance: endingBalance

                });
                balance = endingBalance;

                if (balance <= 0.01) break;

            }

            return schedule;


        };

        {/* Calculate Trade-in */ }

        const calculateTradeInValue = () => {
            const { brand, year, model, mileage, condition } = application.vehicle.tradeIn;

            if (!model) {
                alert('Please select MG model');
                return;
            }

            const currentYear = new Date().getFullYear();
            const age = currentYear - year;

            //Annual Depreciation Rate
            const getAnnualDepreciationRate = (yearAge) => {
                switch (yearAge) {
                    case 1: return 0.23; // 23% 
                    case 2: return 0.18; // 18% 
                    case 3: return 0.15; // 15% 
                    case 4: return 0.12; // 12%
                    case 5: return 0.10; // 10%
                    case 6: return 0.08; // 8%
                    case 7: return 0.08; // 8%
                    case 8: return 0.07; // 7%
                    case 9: return 0.07; // 7%
                    case 10: return 0.06; // 6%
                    default: return 0.05; // 5% 

                }
            };

            let baseValue = tradeInBaseValues[brand]?.[model] || 16000;
            let currentValue = baseValue;

            for (let yearAge = 1; yearAge <= age; yearAge++) {
                const annualRate = getAnnualDepreciationRate(yearAge);
                currentValue = currentValue * (1 - annualRate);
            }

            //set ExpectedMiles = 12000km / Year
            const expectedMiles = age * 12000;

            //set 0.05$ as value to Multiply by Miles
            if (mileage > expectedMiles) {
                const excessMiles = mileage - expectedMiles;
                currentValue = currentValue - (excessMiles * 0.05);
            } else {
                const bonusMiles = expectedMiles - mileage;
                currentValue = currentValue + (bonusMiles * 0.05);
            }
            
            

            //Condition Adjustment
            const conditionMultipliers = {
                'excellent': 1.05,
                'good': 1.0,
                'fair': 0.85,
                'poor': 0.7
            };
            currentValue *= conditionMultipliers[condition] || 1.0;

            // Ensure minimum value
            currentValue = Math.max(1000, currentValue);
            currentValue = Math.round(currentValue);

            setApplication(prev => ({
                ...prev,
                vehicle: {
                    ...prev.vehicle,
                    tradeIn: {
                        ...prev.vehicle.tradeIn,
                        estimatedValue: currentValue,
                        netValue: currentValue
                    }
                }
            }));

            calculateLoan(application.vehicle.newCar.price, currentValue);
        };


        const calculateLoan = (newCarPrice, tradeInValue = application.vehicle.tradeIn.netValue) => {

            const { downPaymentRatio, loanTerm, interestRate } = application.loan;

            const downPayment = newCarPrice * downPaymentRatio / 100;
            const loanAmount = Math.max(0, newCarPrice - downPayment - tradeInValue);
            const monthlyRate = interestRate / 100 / 12;

            let monthlyPayment;

            if (monthlyRate === 0) {
                monthlyPayment = loanAmount / loanTerm;
            } else {
                monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
            }
            monthlyPayment = parseFloat(monthlyPayment.toFixed(2));

            //Detailed breakdown
            const amortizationSchedule = generateAmortizationSchedule(
                loanAmount,
                monthlyRate,
                monthlyPayment,
                loanTerm
            );

            const totalPayments = parseFloat(amortizationSchedule.reduce((sum, payment) => sum + payment.payment, 0).toFixed(2));
            const totalInterest = parseFloat(amortizationSchedule.reduce((sum, payment) => sum + payment.interest, 0).toFixed(2));

            setApplication(prev => ({
                ...prev,
                loan: {
                    ...prev.loan,
                    loanAmount,
                    downPayment,
                    downPaymentRatio,
                    interestRate,
                    loanTerm,
                    monthlyPayment,
                    totalInterest,
                    totalCost: totalPayments,
                    amortizationSchedule
                }
            }));

        };

        const handleLoanChange = (field, value) => {
            const newLoan = { ...application.loan, [field]: value };
            calculateLoan(
                application.vehicle.newCar.price,
                application.vehicle.tradeIn.netValue
            );
        };

        const handleOverlayClick = (e) => {
            if (e.target === e.currentTarget) {
                setShowMonthlyPayments(false);
            }
        };

        useEffect(() => {
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    setShowMonthlyPayments(false);
                }
            };

            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }, []);

        const LoanSummary = () => {
            const firstPayment = application.loan.amortizationSchedule[0];
            return (
                <div className="calculator-card summary-card">
                    <div className="card-header">
                        <i className="fas fa-file-invoice-dollar"></i>
                        <h5>Loan Summary</h5>
                    </div>

                    <div className="simple-summary">
                        <div className="first-payment-display">
                            <div className="payment-label">First Monthly Payment</div>
                            <div className="payment-amount">${application.loan.monthlyPayment.toFixed(2)}</div>
                            {firstPayment && (
                                <div className="payment-breakdown">
                                    <div className="breakdown-item">
                                        <span className="breakdown-label">Principal</span>
                                        <span className="breakdown-value">${firstPayment.principal.toFixed(2)}</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <span className="breakdown-label">Interest</span>
                                        <span className="breakdown-value">${firstPayment.interest.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="summary-actions">
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setShowMonthlyPayments(true)}
                            >
                                <i className="fas fa-list-alt"></i> View All {application.loan.loanTerm} Monthly Payments
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div className="application-container">
                <div className="card">
                    <div className="card-header">
                        <h2>MG Trade-In Application</h2>
                        <div className="step-indicator">
                            <span className={currentStep >= 1 ? 'active' : ''}>1. Vehicle Selection</span>
                            <span className={currentStep >= 2 ? 'active' : ''}>2. Review & Submit</span>
                        </div>
                    </div>

                    {currentStep === 1 && (
                        <div className="step-content">
                            <div className="step-header">
                                <h3>Select Vehicle Brand & Model</h3>
                                <p>Choose your preferred MG vehicle and configure your loan terms</p>
                            </div>

                            <div className="brand-selector">
                                <div className="brand-options">
                                    {Object.keys(vehicleBrands).map(brand => (
                                        <div
                                            key={brand}
                                            className={`brand-option ${selectedBrand === brand ? 'active' : ''}`}
                                            onClick={() => handleBrandChange(brand)}

                                        >
                                            <div className="brand-logo">
                                                <img
                                                    src={`/images/brands/${brand.toLowerCase().replace(' ', '-')}.png`}
                                                    alt={brand}
                                                    onError={(e) => {
                                                        e.target.src = '/images/brands/default-car-logo.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="brand-name"></div>
                                            <div className="model-count">{vehicleBrands[brand].length} models </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="car-model-selector">
                                <div className="model-selector-header">
                                    <h4>{selectedBrand} Models</h4>
                                </div>
                             </div>

                            <div className="car-model-grid">
                                {vehicleBrands[selectedBrand].map(model => (
                                    <div
                                        key={model.id}
                                        className={`car-model-option ${application.vehicle.newCar.model === model.name && application.vehicle.brand === selectedBrand ? 'selected' : ''}`}
                                        onClick={() => handleVehicleSelect(model)}
                                    >
                                        <div className="car-image">
                                            <img
                                                src={model.image}
                                                alt={model.name}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = '/images/cars/car-placeholder.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className="car-model-name">{model.name}</div>
                                        <div className="car-model-price">${model.price.toLocaleString()}</div>
                                        <div className="car-model-features">{model.features}</div>
                                        {application.vehicle.newCar.model === model.name && (
                                            <div className="selected-badge">
                                                <i className="fas fa-check"></i> Selected
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="trade-in-section">
                                <div className="section-header">
                                    <div className="section-icon">
                                        <i className="fas fa-exchange-alt"></i>
                                    </div>
                                    <div className="section-title">
                                        <h3>Trade-In Your Current Vehicle</h3>
                                        <p>Get a valuation for your current vehicle</p>

                                    </div>
                                </div>

                                <div className="trade-in-form-container">
                                    <div className="form-grid">
                                        <div className="form-group premium-input full-width">
                                            <label className="input-label">
                                                <i className="fas fa-tag"></i>
                                                Vehicle Brand
                                            </label>
                                            <div className="brand-selector-mini">
                                                {Object.keys(tradeInModels).map(brand => (
                                                    <div
                                                        key={brand}
                                                        className={`brand-mini-option ${selectedTradeInBrand === brand ? 'active' : ''}`}
                                                        onClick={() => handleTradeInBrandChange(brand)}

                                                    >
                                                        <img
                                                            src={`/images/brands/${brand.toLowerCase().replace(' ', '-')}.png`}
                                                            alt={brand}
                                                            className="brand-mini-logo"
                                                            onError={(e) => {
                                                                e.target.src = '/images/brands/default-car-logo.png';
                                                            }}
                                                        />
                                                        <span>{brand}</span>
                                                    </div>
                                                ))}
                                            </div>
                                         </div>

                                        <div className="form-group premium-input">
                                            <label className="input-label">
                                                <i className="fas fa-car"></i>
                                                Vehicle Model
                                            </label>
                                            <select
                                                value={application.vehicle.tradeIn.model}
                                                onChange={(e) => handleNestedInputChange('vehicle', 'tradeIn', 'model', e.target.value)}
                                                className="modern-select"
                                            >
                                                <option value="">Select Model</option>
                                                {tradeInModels[selectedTradeInBrand].map(model => (
                                                    <option key={model} value={model}>{model}</option>
                                                ))}
                                            </select>
                                       </div>

                                        <div className="form-group premium-input">
                                            <label className="input-label">
                                                <i className="fas fa-calendar"></i>
                                                Vehicle Year
                                            </label>
                                            <select
                                                value={application.vehicle.tradeIn.year}
                                                onChange={(e) => handleNestedInputChange('vehicle', 'tradeIn', 'year', parseInt(e.target.value))}
                                                className="modern-select"
                                            >
                                                {Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group premium-input">
                                            <label className="inut-label">
                                                <i className="fas fa-tachometer-alt"></i>
                                                Mileage (KM)
                                            </label>
                                            <div className="input-with-icon">
                                                <input
                                                    type="number"
                                                    value={application.vehicle.tradeIn.mileage}
                                                    onChange={(e) => handleNestedInputChange('vehicle', 'tradeIn', 'mileage', parseInt(e.target.value) || 0)}
                                                    className="modern-input"
                                                    min="0"
                                                    max="300000"
                                                    placeholder="Enter Km"
                                                />
                                                <i className="fas fa-road input-icon"></i>
                                            </div>
                                         </div>

                                        <div className="form-group premium-input">
                                            <label className="input-label">
                                                <i className="fas fa-star"></i>
                                                Vehicle Condition
                                            </label>
                                            
                                            <select
                                                value={application.vehicle.tradeIn.condition}
                                                onChange={(e) => handleNestedInputChange('vehicle', 'tradeIn', 'condition', e.target.value)}
                                                className="modern-select"
                                            >
                                                <option value="excellent">Excellent</option>
                                                <option value="good">Good</option>
                                                <option value="fair">Fair</option>
                                                <option value="poor">Poor</option>

                                            
                                            </select>
                                        </div>

                                        <div className="form-group full-width">
                                            <button
                                                className="premium-button"
                                                onClick={calculateTradeInValue}
                                                disabled={!application.vehicle.tradeIn.model}
                                            >
                                                <i className="fas fa-calculator"></i>
                                                Calculate Trade-In Value
                                            </button>
                                        </div>
                                    </div>
                                    {application.vehicle.tradeIn.estimatedValue > 0 && (

                                        <div className="trade-value-results">
                                            <div className="value-card premium-card">
                                                <div className="value-icon">
                                                    <i className="fas fa-dollar-sign"></i>
                                                </div>
                                                <div className="value-content">
                                                    <div className="value-label">Estimated Trade-In Value</div>
                                                    <div className="value-amount">
                                                        ${application.vehicle.tradeIn.estimatedValue.toLocaleString()}
                                                    </div>
                                                    <div className="value-subtitle">
                                                    This amount will be applied towards your new vehicle purchase
                                                    </div>

                                                </div>
                                                <div className="value-badge">
                                                    <i className="fas fa-check-circle"></i>
                                            </div>
                                            </div>
                                        </div>
                                    )}                            
                                </div>
                            </div>

                            <div className="loan-calculator">
                                <div className="calculator-header">
                                    <div className="calculator-icon">
                                        <i className="fas fa-calculator"></i>
                                    </div>
                                    <h4>Loan Calculator</h4>
                                    <div className="calculator-subtitle">Customize your loan terms</div>
                                </div>

                                <div className="calculator-grid">
                                    <div className="calculator-card price-breakdown-card">
                                        <div className="card-header">
                                            <i className="fas fa-receipt"></i>
                                            <h5>Purchase Breakdown</h5>
                                        </div>

                                        <div className="breakdown-items">
                                            <div className="breakdown-item">
                                                <div className="breakdown-label">
                                                    New Vehicle Price
                                                </div>
                                            <div className="breakdown-value">
                                                ${application.vehicle.newCar.price.toLocaleString()}
                                            </div>
                                            </div>
                                            {application.vehicle.tradeIn.netValue > 0 && (
                                                <>
                                                    <div className="breakdown-item deduction trade-in-highlight">
                                                        <div className="breakdown-label">
                                                            <i className="fas fa-exchange-alt"></i>
                                                            Trade-In Value Applied
                                                        </div>
                                                        <div className="breakdown-value">
                                                          - ${application.vehicle.tradeIn.netValue.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div className="breakdown-item net-price">
                                                        <div className="breakdown-label">
                                                            <strong>Net Vehicle Cost</strong>
                                                        </div>
                                                        <div className="breakdown-value">
                                                            <strong>
                                                                ${(application.vehicle.newCar.price - application.vehicle.tradeIn.netValue).toLocaleString()}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </>
                                            )}


                                        <div className="breakdown-item deduction">
                                            <div className="breakdown-label">
                                                Down Payment ({application.loan.downPaymentRatio}%)
                                            </div>
                                            <div className="breakdown-value">
                                                - ${application.loan.downPayment.toLocaleString()}
                                            </div>
                                        </div>

                                            {/* 
                                        {application.vehicle.tradeIn.netValue > 0 && (
                                            <div className="breakdown-item deduction trade-in-highlight">
                                                <div className="breakdown-label">
                                                    <i className="fas fa-exchange-alt"></i>
                                                    Trade-In Value
                                                </div>
                                                <div className="breakdown-value">
                                                    - ${application.vehicle.tradeIn.netValue.toLocaleString()}
                                                </div>
                                            </div>
                                        )}
                                        */}

                                        <div className="breakdown-divider"></div>
                                            <div className="breakdown-item total-loan">
                                                <div className="breakdown-label">
                                                    <strong>Amount to Finance</strong>
                                            </div>
                                            <div className="breakdown-value">
                                                <strong>${application.loan.loanAmount.toLocaleString()}</strong>
                                            </div>

                                        </div>
                                       </div>                                      
                                    </div>

                                    <div className="calculator-card slider-card">
                                        <div className="card-header">
                                            <div className="card-title">
                                                <i className="fas fa-money-bill-wave"></i>
                                                <span>Down Payment</span>
                                            </div>
                                            <div className="value-display">
                                                <span className="percentage">{application.loan.downPaymentRatio}%</span>
                                                <span className="amount">${application.loan.downPayment.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <input
                                            type="range"
                                            min="10"
                                            max="50"
                                            step="5"
                                            value={application.loan.downPaymentRatio}
                                            onChange={(e) => handleLoanChange('downPaymentRatio', parseInt(e.target.value))}
                                            className="modern-slider"
                                        />
                                        <div className="slider-labels">
                                            <span>10%</span>
                                            <span>50%</span>
                                        </div>
                                    </div>

                                    <div className="calculator-card slider-card">
                                        <div className="card-header">
                                            <div className="card-title">
                                                <i className="fas fa-calendar-alt"></i>
                                                <span>Loan Term</span>
                                            </div>
                                            <div className="value-display">
                                                <span className="months">{application.loan.loanTerm} months</span>
                                                <span className="years">({(application.loan.loanTerm / 12)} years)</span>
                                            </div>
                                        </div>
                                        <input
                                            type="range"
                                            min="12"
                                            max="84"
                                            step="12"
                                            value={application.loan.loanTerm}
                                            onChange={(e) => handleLoanChange('loanTerm', parseInt(e.target.value))}
                                            className="modern-slider"
                                        />
                                        <div className="slider-labels">
                                            <span>12 mo</span>
                                            <span>84 mo</span>
                                        </div>
                                    </div>

                                    <div className="calculator-card slider-card">
                                        <div className="card-header">
                                            <div className="card-title">
                                                <i className="fas fa-percentage"></i>
                                                <span>Interest Rate</span>
                                            </div>
                                            <div className="value-display">
                                                <span className="rate">{application.loan.interestRate}%</span>
                                                <span className="rate-type">APR</span>
                                            </div>
                                        </div>
                                        <input
                                            type="range"
                                            min="2"
                                            max="15"
                                            step="0.1"
                                            value={application.loan.interestRate}
                                            onChange={(e) => handleLoanChange('interestRate', parseFloat(e.target.value))}
                                            className="modern-slider"
                                        />
                                        <div className="slider-labels">
                                            <span>2%</span>
                                            <span>15%</span>
                                        </div>
                                    </div>

                                    <LoanSummary />
                                </div>
                            </div>

                            <div className="step-actions">
                                <button className="btn btn-primary" onClick={() => setCurrentStep(2)}>
                                    Next: Review & Submit <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="step-content">
                            <h3>Review & Submit Application</h3>
                            <div className="review-summary">
                                <p>Your MG trade-in selection and loan terms are complete. Click below to proceed to the final application review.</p>

                                <div className="summary-grid">
                                    <div className="summary-card">
                                        <h4><i className="fas fa-car"></i> New Vehicle</h4>
                                        <div className="summary-item">
                                            <span>Model:</span>
                                            <span>{application.vehicle.newCar.model}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span>Price:</span>
                                            <span>${application.vehicle.newCar.price.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="summary-card">
                                        <h4><i className="fas fa-exchange-alt"></i> Trade-In Vehicle</h4>
                                        <div className="summary-item">
                                            <span>Vehicle:</span>
                                            <span>{application.vehicle.tradeIn.year} MG {application.vehicle.tradeIn.model}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span>Trade-In Value:</span>
                                            <span>${application.vehicle.tradeIn.netValue.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="summary-card">
                                        <h4><i className="fas fa-file-invoice-dollar"></i> Loan Details</h4>
                                        <div className="summary-item">
                                            <span>Loan Amount:</span>
                                            <span>${application.loan.loanAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span>Monthly Payment:</span>
                                            <span className="payment">${application.loan.monthlyPayment.toFixed(2)}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span>Interest Rate:</span>
                                            <span>{application.loan.interestRate}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="button-group">
                                <button className="btn btn-outline" onClick={() => setCurrentStep(1)}>
                                    Back to Vehicle Selection
                                </button>
                                <button className="btn btn-success" onClick={() => navigate('/application-review', { state: { application } })}>
                                    Continue to Application Review
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Monthly Payments Modal */}
                {showMonthlyPayments && (
                    <div className="modal-overlay" onClick={handleOverlayClick}>
                        <div className="modal-content payments-modal">
                            <div className="modal-header">
                                <div className="modal-title">
                                    <i className="fas fa-calendar-alt"></i>
                                    <h4>Complete Monthly Payment Schedule</h4>
                                </div>
                                <button
                                    className="modal-close"
                                    onClick={() => setShowMonthlyPayments(false)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="modal-subtitle">
                                    <p>Detailed payment breakdown for all {application.loan.loanTerm} months of your {application.loan.loanTerm / 12}-year loan</p>
                                </div>

                                <div className="payment-overview">
                                    <div className="overview-item">
                                        <div className="overview-label">Monthly Payment</div>
                                        <div className="overview-value">${application.loan.monthlyPayment.toFixed(2)}</div>
                                    </div>
                                    <div className="overview-item">
                                        <div className="overview-label">Total Payments</div>
                                        <div className="overview-value">{application.loan.loanTerm} months</div>
                                    </div>
                                    <div className="overview-item">
                                        <div className="overview-label">Total Interest</div>
                                        <div className="overview-value">${application.loan.totalInterest.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div className="amortization-table-container">
                                    <table className="amortization-table">
                                        <thead>
                                            <tr>
                                                <th>Month</th>
                                                <th>Payment Date</th>
                                                <th>Payment Amount</th>
                                                <th>Principal</th>
                                                <th>Interest</th>
                                                <th>Remaining Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {application.loan.amortizationSchedule.map((payment, index) => {
                                                const today = new Date();
                                                const paymentDate = new Date(today.getFullYear(), today.getMonth() + payment.month, 15);
                                                const formattedDate = paymentDate.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    year: 'numeric'
                                                });

                                                return (
                                                    <tr key={index} className={index === 0 ? 'current-payment' : ''}>
                                                        <td className="month-number">{payment.month}</td>
                                                        <td className="payment-date">{formattedDate}</td>
                                                        <td className="payment-total">${payment.payment.toFixed(2)}</td>
                                                        <td className="payment-principal">${payment.principal.toFixed(2)}</td>
                                                        <td className="payment-interest">${payment.interest.toFixed(2)}</td>
                                                        <td className="remaining-balance">${payment.remainingBalance.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="summary-totals">
                                    <div className="total-item">
                                        <span>Total Loan Amount:</span>
                                        <span>${application.loan.loanAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="total-item">
                                        <span>Total Interest Paid:</span>
                                        <span>${application.loan.totalInterest.toFixed(2)}</span>
                                    </div>
                                    <div className="total-item grand-total">
                                        <span>Total Amount Paid:</span>
                                        <span>${application.loan.totalCost.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-outline"
                                    onClick={() => setShowMonthlyPayments(false)}
                                >
                                    Close Payment Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    export default TradeInApplication;





       
                                  