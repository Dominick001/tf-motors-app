import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewCarApplication = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showMonthlyPayments, setShowMonthlyPayments] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState('MG');
    const [editingCarId, setEditingCarId] = useState(null);
    const [tempCardPrice, setTempCardPrice] = useState(0);
    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const [tempPrice, setTempPrice] = useState(0);
    const [application, setApplication] = useState({
        vehicle: {
            type: 'new',
            brand: 'MG',
            newCar: {
                model: 'MG ZS 2025',
                price: 26500,
                color: 'White'
            }
        },
        loan: {
            loanAmount: 21200,
            downPayment: 5300,
            downPaymentRatio: 20,
            interestRate: 5.5,
            loanTerm: 60,
            monthlyPayment: 405.16,
            totalInterest: 3109.60,
            totalCost: 24309.60,
            amortizationSchedule: []
        }
    });

    // Add debug logging
    console.log('Current amortization schedule:', application.loan.amortizationSchedule);
    console.log('Schedule length:', application.loan.amortizationSchedule.length);

    useEffect(() => {
        setTempPrice(application.vehicle.newCar.price);
    }, [application.vehicle.newCar.price]);

    useEffect(() => {
        console.log('Initial calculation running...');
        calculateLoan(
            application.vehicle.newCar.price,
            application.loan.downPaymentRatio,
            application.loan.loanTerm,
            application.loan.interestRate
        );
    }, []);

    const [vehicleBrands, setVehicleBrands] = useState ({
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
    });

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

    const handleVehicleSelect = (model, brand = selectedBrand) => {
        setApplication(prev => ({
            ...prev,
            vehicle: {
                ...prev.vehicle,
                brand: brand,
                newCar: {
                    model: model.name,
                    price: model.price,
                    color: 'White'
                }
            }
        }));

        calculateLoan(model.price, application.loan.downPaymentRatio,
            application.loan.loanTerm, application.loan.interestRate);
    };
    //Edit Price on Car Card
    const handleCardPriceEditStart = (carId, currentPrice) => {
        setEditingCarId(carId);
        setTempCardPrice(currentPrice);
    };

    const handleCardPriceEditSave = (carId) => {
        if (tempCardPrice < 1000) {
            alert('Price must be at least $1000');
            return;
        }
        setVehicleBrands(prevBrands => {
            const updatedBrands = { ...prevBrands };
            Object.keys(updatedBrands).forEach(brand => {
                updatedBrands[brand] = updatedBrands[brand].map(car =>
                    car.id === carId ? { ...car, price: tempCardPrice } : car
                );
            });
            return updatedBrands;
        });

        if (application.vehicle.newCar.model === vehicleBrands[selectedBrand].find(car => car.id === carId)?.name) {
            setApplication(prev => ({
                ...prev,
                vehicle: {
                    ...prev.vehicle,
                    newCar: {
                        ...prev.vehicle.newCar,
                        price: tempCardPrice
                    }
                }
            }));
            calculateLoan(
                tempCardPrice,
                application.loan.downPaymentRatio,
                application.loan.loanTerm,
                application.loan.interestRate
            );
        }

        setEditingCarId(null);
    };

    const handleCardPriceEditCancel = () => {
        setEditingCarId(null);
        setTempCardPrice(0);
    };

    const handleCardPriceChange = (e) => {
        const newPrice = parseInt(e.target.value) || 0;
        setTempCardPrice(newPrice);
    };


    //Edit Price Vehicle Price Section
    const handlePriceEditStart = () => {
        setTempPrice(application.vehicle.newCar.price);
        setIsEditingPrice(true);
    };

    const handlePriceEditSave = () => {
        if (tempPrice < 1000) {
            alert('Price must be at least $1000');
            return;
        }
        setApplication(prev => ({
            ...prev,
            vehicle: {
                ...prev.vehicle,
                newCar: {
                    ...prev.vehicle.newCar,
                    price: tempPrice
                }
            }
        }));
        setIsEditingPrice(false);

        //Recalculate loan with new price
        calculateLoan(
            tempPrice,
            application.loan.downPaymentRatio,
            application.loan.loanTerm,
            application.loan.interestRate
        );
    };

    const handlePriceEditCancel = () => {
        setIsEditingPrice(false);
        setTempPrice(application.vehicle.newCar.price);
    };

    const handlePriceChange = (e) => {
        const newPrice = parseInt(e.target.value) || 0;
        setTempPrice(newPrice);
    };


    const generateAmortizationSchedule = (loanAmount, monthlyRate, monthlyPayment, term) => {
        console.log('Generating schedule with:', { loanAmount, monthlyRate, monthlyPayment, term });
        const schedule = [];
        let balance = parseFloat(loanAmount.toFixed(2));

        for (let month = 1; month <= term; month++) {
            const interestPayment = parseFloat((balance * monthlyRate).toFixed(2));
            let principalPayment = parseFloat((monthlyPayment - interestPayment).toFixed(2));

            // Handle final payment
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

            console.log(`Month ${month}:`, {
                payment: actualPayment,
                principal: principalPayment,
                interest: interestPayment,
                remainingBalance: endingBalance
            });

            balance = endingBalance;

            if (balance <= 0.01) break;
        }

        console.log('Generated schedule length:', schedule.length);
        return schedule;
    };

    const calculateLoan = (price, dpRatio, term, rate) => {
        console.log('Calculating loan with:', { price, dpRatio, term, rate });

        const downPayment = parseFloat((price * dpRatio / 100).toFixed(2));
        const loanAmount = parseFloat((price - downPayment).toFixed(2));
        const monthlyRate = rate / 100 / 12;

        let monthlyPayment;
        if (monthlyRate === 0) {
            monthlyPayment = loanAmount / term;
        } else {
            monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
                (Math.pow(1 + monthlyRate, term) - 1);
        }

        monthlyPayment = parseFloat(monthlyPayment.toFixed(2));
        console.log('Monthly payment calculated:', monthlyPayment);

        const amortizationSchedule = generateAmortizationSchedule(loanAmount, monthlyRate, monthlyPayment, term);

        const totalPayments = parseFloat(amortizationSchedule.reduce((sum, payment) => sum + payment.payment, 0).toFixed(2));
        const totalInterest = parseFloat(amortizationSchedule.reduce((sum, payment) => sum + payment.interest, 0).toFixed(2));

        console.log('Final totals:', { totalPayments, totalInterest });

        setApplication(prev => ({
            ...prev,
            loan: {
                loanAmount,
                downPayment,
                downPaymentRatio: dpRatio,
                interestRate: rate,
                loanTerm: term,
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
            newLoan.downPaymentRatio,
            newLoan.loanTerm,
            newLoan.interestRate
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
                        <div className="payment-label">Estimated Monthly Payment</div>
                        <div className="payment-amount">${application.loan.monthlyPayment.toFixed(2)}</div>
                        {/* 
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
                        */}
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
                    <h2>New Car Loan Application</h2>
                    <div className="step-indicator">
                        <span className={currentStep >= 1 ? 'active' : ''}>1. Vehicle Selection</span>
                        <span className={currentStep >= 2 ? 'active' : ''}>2. Review & Submit</span>
                    </div>
                </div>

                {currentStep === 1 && (
                    <div className="step-content">
                        <div className="step-header">
                            <h3>Select Vehicle Brand & Model</h3>
                            <p>Choose your preferred MG vehicle and check your loan term</p>
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
                                        <div className="model-count">{vehicleBrands[brand].length} models</div>
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

                                    {/* Editable Price Section */}
                                            <div className="car-model-price-section">
                                                {editingCarId === model.id ? (
                                                    <div className="card-price-edit">
                                                        <div className="price-input-container">
                                                            <span className="currency">$</span>
                                                            <input
                                                                type="number"
                                                                value={tempCardPrice}
                                                                onChange={handleCardPriceChange}
                                                                className="card-price-input"
                                                                min="1000"
                                                                max="100000"
                                                                step="100"
                                                                autoFocus
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleCardPriceEditSave(model.id);
                                                                    if (e.key === 'Escape') handleCardPriceEditCancel();
                                                                }}

                                                            />
                                                        </div>
                                                        <div className="card-price-actions">
                                                            <button
                                                                className="btn btn-success "
                                                                onClick={() => handleCardPriceEditSave(model.id)}
                                                            >
                                                                <i className="fas fa-check"></i>Save
                                                            </button>
                                                            <button
                                                                className="btn btn-outline btn-xs"
                                                                onClick={handleCardPriceEditCancel}
                                                            >
                                                                <i className="fas fa-times"></i>Cancel
                                                            </button>

                                                        </div>

                                                    </div>
                                                ) : (
                                                        <div
                                                            className="car-model-price editable"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCardPriceEditStart(model.id, model.price)
                                                            }}
                                                            title="Click to edit price"
                                                        >
                                                            ${model.price.toLocaleString()}
                                                            <i className="fas fa-edit price-edit-icon"></i>
                                                        </div>
                                                )}
                                            </div>
                                            <div className="car-model-features">{model.features}</div>

                                    {application.vehicle.newCar.model === model.name && (
                                        <div className="selected-badge">
                                            <i className="fas fa-check"></i> Selected
                                        </div>
                                    )}
                                </div>
                            ))}
                     </div>
                        

                        <div className="loan-calculator">
                            <div className="calculator-header">
                                <div className="calculator-icon">
                                    <i className="fas fa-calculator"></i>
                                </div>
                                <h4>Loan Calculator</h4>
                                <div className="calculator-subtitle">Adjust sliders to see different scenarios</div>
                            </div>

                            <div className="calculator-grid">
                                <div className="calculator-card price-card">
                                    <div className="card-icon">
                                        <i className="fas fa-car"></i>
                                    </div>
                                    <div className="card-content">
                                        <label>Vehicle Price</label>
                                        {/* 
                                        <div className="price-display">${application.vehicle.newCar.price.toLocaleString()}</div>
                                        <div className="price-subtitle">{application.vehicle.newCar.model}</div>
                                        */}
                                        {isEditingPrice ? (
                                            <div className="price-edit-container">
                                                <div className="price-input-wrapper">
                                                    <span className="currency-symbol">$</span>
                                                    <input
                                                        type="number"
                                                        value={tempPrice}
                                                        onChange={handlePriceChange}
                                                        className="price-input"
                                                        min="1000"
                                                        max="100000"
                                                        step="100"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handlePriceEditSave();
                                                            }
                                                            if (e.key === 'Escape') {
                                                                handlePriceEditCancel();
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="price-edit-actions">
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={handlePriceEditSave}
                                                    >
                                                        <i className="fas fa-check"></i> Save
                                                    </button>
                                                    <button
                                                        className="btn btn-outline btn-sm"
                                                        onClick={handlePriceEditCancel}
                                                    >
                                                        <i className="fas fa-times"></i> Cancel 
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                                <div className="price-display-container">
                                                    <div
                                                        className="price-display editable"
                                                        onClick={handlePriceEditStart}
                                                        title="Click to edit price"
                                                    >
                                                        ${application.vehicle.newCar.price.toLocaleString()}
                                                        <i className="fas fa-edit edit-icon"></i>
                                                    </div>
                                                    
                                            </div>
                                        )}
                                     </div>
                                </div>

                                {/* Down Payment Slider */}
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
                                        <div className="label-group">
                                            <span className="label">10%</span>
                                            <span className="value">${(application.vehicle.newCar.price * 0.1).toLocaleString()}</span>
                                        </div>
                                        <div className="label-group">
                                            <span className="label">50%</span>
                                            <span className="value">${(application.vehicle.newCar.price * 0.5).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Loan Term Slider */}
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
                                        <div className="label-group">
                                            <span className="label">1 Year</span>
                                            <span className="value">12 months</span>
                                        </div>
                                        <div className="label-group">
                                            <span className="label">7 Years</span>
                                            <span className="value">84 months</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Interest Rate Slider */}
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
                                        <div className="label-group">
                                            <span className="label">2%</span>
                                            <span className="value">Low</span>
                                        </div>
                                        <div className="label-group">
                                            <span className="label">15%</span>
                                            <span className="value">High</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="calculator-card inputs-card">
                                    <div className="card-header">
                                        <i className="fas fa-edit"></i>
                                        <h5>Manual Inputs</h5>
                                    </div>
                                    <div className="input-grid">
                                        <div className="input-group modern-input">
                                            <label>
                                                <i className="fas fa-money-bill-wave"></i>
                                                Down Payment (%)
                                            </label>
                                            <div className="input-wrapper">
                                                <input
                                                    type="number"
                                                    min="10"
                                                    max="50"
                                                    value={application.loan.downPaymentRatio}
                                                    onChange={(e) => handleLoanChange('downPaymentRatio', Math.min(50, Math.max(10, parseInt(e.target.value) || 10)))}
                                                />
                                                <span className="input-suffix">%</span>
                                            </div>
                                        </div>

                                        <div className="input-group modern-input">
                                            <label>
                                                <i className="fas fa-calendar-alt"></i>
                                                Loan Term
                                            </label>
                                            <div className="input-wrapper">
                                                <input
                                                    type="number"
                                                    min="12"
                                                    max="84"
                                                    step="12"
                                                    value={application.loan.loanTerm}
                                                    onChange={(e) => handleLoanChange('loanTerm', Math.min(84, Math.max(12, parseInt(e.target.value) || 12)))}
                                                />
                                                <span className="input-suffix">months</span>
                                            </div>
                                        </div>

                                        <div className="input-group modern-input">
                                            <label>
                                                <i className="fas fa-percentage"></i>
                                                Interest Rate
                                            </label>
                                            <div className="input-wrapper">
                                                <input
                                                    type="number"
                                                    min="2"
                                                    max="15"
                                                    step="0.1"
                                                    value={application.loan.interestRate}
                                                    onChange={(e) => handleLoanChange('interestRate', Math.min(15, Math.max(2, parseFloat(e.target.value) || 2)))}
                                                />
                                                <span className="input-suffix">%</span>
                                            </div>
                                        </div>
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
                            <p>Your vehicle selection and loan terms are complete. Click below to proceed to the final application review where you'll provide your personal information.</p>
                            <div className="selected-vehicle-review">
                                <h4>Selected Vehicle</h4>
                                <div className="review-item">
                                    <span className="label">Model:</span>
                                    <span className="value">{application.vehicle.newCar.model}</span>
                                </div>
                                <div className="review-item">
                                    <span className="label">Price:</span>
                                    <span className="value">${application.vehicle.newCar.price.toLocaleString()}</span>
                                </div>
                                <div className="review-item">
                                    <span className="label">Monthly Payment:</span>
                                    <span className="value payment">${application.loan.monthlyPayment.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="button-group">
                            <button className="btn btn-outline" onClick={() => setCurrentStep(1)}>
                                Back to Vehicle Selection
                            </button>
                            <button className="btn btn-success" onClick={() => navigate('/review/:id', { state: { application } })}>
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
                                        {application.loan.amortizationSchedule.length > 0 ? (
                                            application.loan.amortizationSchedule.map((payment, index) => {
                                                const today = new Date();
                                                const paymentDate = new Date(today.getFullYear(), today.getMonth() + payment.month, 15);
                                                const formattedDate = paymentDate.toLocaleDateString('en-US', {
                                                    month: 'short', year: 'numeric'
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
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                                    <i className="fas fa-exclamation-triangle"></i> No payment schedule data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="summary-totals">
                                <div className="total-item">
                                    <span>Total Loan Amount</span>
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

export default NewCarApplication;
