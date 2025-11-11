import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TradeInApplication = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showMonthlyPayments, setShowMonthlyPayments] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState('MG');
    const [editingCarId, setEditingCarId] = useState(null);
    const [tempCardPrice, setTempCardPrice] = useState(0);
    const [editingTradeInValue, setEditingTradeInValue] = useState(null);
    const [tempTradeInPrice, setTempTradeInPrice] = useState(0);
    const [selectedTradeInBrand, setSelectedTradeInBrand] = useState('MG');
    const [selectedTradeInValue, setSelectedTradeInValue] = useState(0);
    

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
                estimatedValue: 0,
                netValue: 0,
                manualValue: 0,
                valueSource: '' // 'table' or 'manual'
            }
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

    const [vehicleBrands, setVehicleBrands ] = useState ({
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

    const tradeInModels = {
        MG: ['ZS', 'GT', 'RX5', 'MG 7', 'RX9', 'Cyberster', 'MG3', 'MG5', 'MG6', 'HS', 'Marvel R', 'MG4', 'G50'],
        Maxus: ['V80', 'Mifa 9', 'D60', 'Mifa 7', 'G90', 'T60', 'T70', 'G10', 'G20'],
        LeapMotor: ['T03', 'C10']
    };

    //supported brand with fixed values
    const supportedTradeInBrands = ['MG', 'Maxus', 'LeapMotor'];

    // All available brands (supported + custom)
    const otherTradeInBrands = ['Toyota', 'Mazda', 'Honda', 'Ford', 'Hyundai', 'Kia', 'Nissan', 'Other'];

    // Enhanced Fixed Trade-in Values with better structure
    const [tradeInFixedValues, setTradeInFixedValues] = useState({
        MG: {
            'ZS': [
                { year: 2025, value: 22000 },
                { year: 2024, value: 20000 },
                { year: 2023, value: 18000 },
                { year: 2022, value: 16000 },
                { year: 2021, value: 14000 },
                { year: 2020, value: 12000 }
            ],
            'GT': [
                { year: 2025, value: 24000 },
                { year: 2024, value: 22000 },
                { year: 2023, value: 20000 },
                { year: 2022, value: 18000 },
                { year: 2021, value: 16000 },
                { year: 2020, value: 14000 }
            ],
            'RX5': [
                { year: 2025, value: 26000 },
                { year: 2024, value: 24000 },
                { year: 2023, value: 22000 },
                { year: 2022, value: 20000 },
                { year: 2021, value: 18000 },
                { year: 2020, value: 16000 }
            ],
            'MG 7': [
                { year: 2025, value: 29000 },
                { year: 2024, value: 27000 },
                { year: 2023, value: 25000 },
                { year: 2022, value: 23000 },
                { year: 2021, value: 21000 },
                { year: 2020, value: 19000 }
            ],
            'RX9': [
                { year: 2025, value: 36000 },
                { year: 2024, value: 34000 },
                { year: 2023, value: 32000 },
                { year: 2022, value: 30000 },
                { year: 2021, value: 28000 },
                { year: 2020, value: 26000 }
            ],
            'Cyberster': [
                { year: 2025, value: 46000 },
                { year: 2024, value: 44000 },
                { year: 2023, value: 42000 },
                { year: 2022, value: 40000 }
            ],
            'MG3': [
                { year: 2025, value: 13000 },
                { year: 2024, value: 12000 },
                { year: 2023, value: 11000 },
                { year: 2022, value: 10000 }
            ],
            'MG5': [
                { year: 2025, value: 16000 },
                { year: 2024, value: 15000 },
                { year: 2023, value: 14000 },
                { year: 2022, value: 13000 }
            ],
            'MG6': [
                { year: 2025, value: 18000 },
                { year: 2024, value: 17000 },
                { year: 2023, value: 16000 },
                { year: 2022, value: 15000 }
            ],
            'HS': [
                { year: 2025, value: 21000 },
                { year: 2024, value: 20000 },
                { year: 2023, value: 19000 },
                { year: 2022, value: 18000 }
            ],
            'Marvel R': [
                { year: 2025, value: 28000 },
                { year: 2024, value: 27000 },
                { year: 2023, value: 26000 },
                { year: 2022, value: 25000 }
            ],
            'MG4': [
                { year: 2025, value: 25000 },
                { year: 2024, value: 24000 },
                { year: 2023, value: 23000 },
                { year: 2022, value: 22000 }
            ],
            'G50': [
                { year: 2025, value: 17000 },
                { year: 2024, value: 16000 },
                { year: 2023, value: 15000 },
                { year: 2022, value: 14000 }
            ]
        },
        Maxus: {
            'V80': [
                { year: 2025, value: 21000 },
                { year: 2024, value: 20000 },
                { year: 2023, value: 19000 },
                { year: 2022, value: 18000 }
            ],
            'Mifa 9': [
                { year: 2025, value: 48000 },
                { year: 2024, value: 47000 },
                { year: 2023, value: 46000 },
                { year: 2022, value: 45000 }
            ],
            'D60': [
                { year: 2025, value: 25000 },
                { year: 2024, value: 24000 },
                { year: 2023, value: 23000 },
                { year: 2022, value: 22000 }
            ],
            'Mifa 7': [
                { year: 2025, value: 38000 },
                { year: 2024, value: 37000 },
                { year: 2023, value: 36000 },
                { year: 2022, value: 35000 }
            ],
            'G90': [
                { year: 2025, value: 41000 },
                { year: 2024, value: 40000 },
                { year: 2023, value: 39000 },
                { year: 2022, value: 38000 }
            ]
        },
        LeapMotor: {
            'T03': [
                { year: 2025, value: 9500 },
                { year: 2024, value: 9000 },
                { year: 2023, value: 8500 },
                { year: 2022, value: 8000 }
            ],
            'C10': [
                { year: 2025, value: 23000 },
                { year: 2024, value: 22000 },
                { year: 2023, value: 21000 },
                { year: 2022, value: 20000 }
            ]
        }
    });


    const handleBrandChange = (brand) => {
        setSelectedBrand(brand);
        const firstModel = vehicleBrands[brand][0];
        handleVehicleSelect(firstModel, brand);
    };

    const handleNestedInputChange = (mainSection, subSection, field, value) => {
        setApplication(prev => ({
            ...prev,
            [mainSection]: {
                ...prev[mainSection],
                [subSection]: {
                    ...(prev[mainSection]?.[subSection] || {}),
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
                brand: selectedBrand,
                newCar: {
                    model: model.name,
                    price: model.price,
                    color: 'White'
                }
            }
        }));
        calculateLoan(model.price);
    };

    const handleModelChange = (model) => {
        setApplication(prev => ({
            ...prev,
            vehicle: {
                ...prev.vehicle,
                tradeIn: {
                    ...prev.vehicle.tradeIn,
                    model: model,
                    estimatedValue: 0,
                    valueSource: ''
                }
            }
        }));
        setSelectedTradeInValue(0);
    };

    //Edit Trade-in Value in Table
    const handleTradeInValueEditStart = (model, year, currentValue) => {
        setEditingTradeInValue({ model, year });
        setTempTradeInPrice(currentValue);

    };

    const handleTradeInValueEditSave = () => {
        if (tempTradeInPrice < 0) {
            alert('Price cannot be negative');
            return;
        }

        if (!editingTradeInValue) return;

        const { model, year } = editingTradeInValue;

        setTradeInFixedValues(prev => {
            const updatedValues = { ...prev };
            const brandValues = updatedValues[selectedTradeInBrand];

            if (brandValues && brandValues[model]) {
                updatedValues[selectedTradeInBrand][model] = brandValues[model].map(item =>
                    item.year === year ? { ...item, value: tempTradeInPrice } : item
                );
            }
            return updatedValues;
        });

        // Update application if this exact year and model is currently selected
        if (application.vehicle.tradeIn.model === model &&
            application.vehicle.tradeIn.year === year &&
            application.vehicle.tradeIn.valueSource === 'table') {

            setApplication(prev => ({
                ...prev,
                vehicle: {
                    ...prev.vehicle,
                    tradeIn: {
                        ...prev.vehicle.tradeIn,
                        estimatedValue: tempTradeInPrice,
                        netValue: tempTradeInPrice
                    }
                }
            }));
            calculateLoan(application.vehicle.newCar.price, tempTradeInPrice);

        }
        setEditingTradeInValue(null);
        setTempTradeInPrice(0);

    };

    const handleTradeInValueEditCancel = () => {
        setEditingTradeInValue(null);
        setTempTradeInPrice(0);
    };

    const handleTradeInPriceChange = (e) => {
        const newPrice = parseInt(e.target.value) || 0;
        setTempTradeInPrice(newPrice);
    };

    //Edit Price on Car Card
    const handleCardPriceEditStart = (carId, currentprice) => {
        setEditingCarId(carId);
        setTempCardPrice(currentprice);
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

        //Update application is this car is currently selected
        const updatedCar = vehicleBrands[selectedBrand].find(car => car.id === carId);
        if (updatedCar && application.vehicle.newCar.model === updatedCar.name) {
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
            calculateLoan(tempCardPrice, application.vehicle.tradeIn?.netValue || 0);
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

    const handleValueSelect = (value, year) => {
        setSelectedTradeInValue(value);
        setApplication(prev => ({
            ...prev,
            vehicle: {
                ...prev.vehicle,
                tradeIn: {
                    ...prev.vehicle.tradeIn,
                    estimatedValue: value,
                    netValue: value,
                    year: year,
                    valueSource: 'table'
                }
            }
        }));

        calculateLoan(application.vehicle.newCar.price, value);
    };

    const handleManualValueChange = (value) => {
        const manualValue = parseInt(value) || 0;
        setApplication(prev => ({
            ...prev,
            vehicle: {
                ...prev.vehicle,
                tradeIn: {
                    ...prev.vehicle.tradeIn,
                    manualValue: manualValue,
                    valueSource: 'manual'
                }
            }
        }));
    };

    const handleTradeInBrandChange = (brand) => {
        setSelectedTradeInBrand(brand);

        const initialModel = supportedTradeInBrands.includes(brand)
            ? (tradeInModels[brand]?.[0] || '')
            : '';

        setApplication(prev => ({
            ...prev,
            vehicle: {
                ...prev.vehicle,
                tradeIn: {
                   // ...prev.vehicle.tradeIn,
                    brand: brand,
                    model: initialModel,
                    estimatedValue: 0,
                    manualValue: 0,
                    valueSource: '',
                    year: new Date().getFullYear() - 3
                }
            }
        }));
        setSelectedTradeInValue(0);
    };

    const applyManualValue = () => {
        const manualValue = application.vehicle.tradeIn.manualValue || 0;
        if (manualValue > 0) {
            setSelectedTradeInValue(manualValue);
            setApplication(prev => ({
                ...prev,
                vehicle: {
                    ...prev.vehicle,
                    tradeIn: {
                        ...prev.vehicle.tradeIn,
                        estimatedValue: manualValue,
                        netValue: manualValue,
                        valueSource: 'manual'
                    }
                }
            }));
            calculateLoan(application.vehicle.newCar.price, manualValue);
        }
    };

    const getAvailableYears = () => {
        const brandValues = tradeInFixedValues[selectedTradeInBrand];
        if (!brandValues) return [];

        const modelValues = brandValues[application.vehicle.tradeIn.model];
        return modelValues || [];
    };

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

    const calculateLoan = (newCarPrice, tradeInValue = application.vehicle.tradeIn?.netValue || 0) => {
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
        setApplication(prev => ({
            ...prev,
            loan: {
                ...prev.loan,
                [field]: value
            }
        }));
    };
        useEffect(() => { 
            calculateLoan(
                application.vehicle.newCar.price,
                application.vehicle.tradeIn?.netValue || 0
            );
            }, [
                application.loan.downPaymentRatio,
                application.loan.loanTerm,
                application.loan.interestRate,
                application.vehicle.newCar.price,
                application.vehicle.tradeIn?.netValue
            ]);

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

    const TradeInValueTable = () => {
        const availableValues = getAvailableYears();
        const currentModel = application.vehicle.tradeIn?.model || '';

        if (!availableValues.length) {
            return (
                <div className="no-values-message">
                    <i className="fas fa-info-circle"></i>
                    <p>No fixed values available for {currentModel}</p>
                    <p>Please use the manual input option below</p>

                </div>
            );
        }

        return (
            <div className="value-table-container">
                <div className="table-header">
                    <h4>
                        <i className="fas fa-table"></i>
                        Fixed Trade-in Values for {application.vehicle.tradeIn.model}
                    </h4>
                    <div className="validity-badge">
                        <i className="fas fa-clock"></i>
                        Valid for 3 months
                    </div>
                </div>

                <div className="table-subtitle">
                    <p>Click on any value to edit it. Changes apply immediately if selected</p>

                </div>

                <div className="value-table">
                    <div className="table-row header-row">
                        <div className="table-cell">Year</div>
                        <div className="table-cell">Trade-in Value</div>
                        <div className="table-cell">Actions</div>
                    </div>

                    {availableValues.map((item, index) => {
                        const isEditing = editingTradeInValue &&
                            editingTradeInValue.model === application.vehicle.tradeIn.model &&
                            editingTradeInValue.year === item.year;

                        return (
                            <div
                                key={index}
                                className={`table-row value-row ${selectedTradeInValue === item.value ? 'selected' : ''
                                    }`}

                            >
                                <div className="table-cell year-cell">
                                    <span className="year-badge">{item.year}</span>
                                </div>
                                <div className="table-cell value-cell">
                                    {isEditing ? (
                                        <div className="trade-in-price-edit">
                                            <div className="price-input-container">
                                                <span className="currency">$</span>
                                                <input
                                                    type="number"
                                                    value={tempTradeInPrice}
                                                    onChange={handleTradeInPriceChange}
                                                    className="trade-in-price-input"
                                                    min="0"
                                                    max="100000"
                                                    step="100"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleTradeInValueEditSave();
                                                        if (e.key === 'Escape') handleTradeInValueEditCancel();
                                                    }}
                                                />
                                            </div>
                                        </div>


                                    ) : (
                                        <div className="value-amount editable"
                                            onClick={() => handleTradeInValueEditStart(
                                                application.vehicle.tradeIn.model,
                                                item.year,
                                                item.value
                                            )}
                                            title="Click to edit value"
                                        >
                                            ${item.value.toLocaleString()}
                                            <i className="fas fa-edit value-edit-icon"></i>
                                        </div>

                                    )} 
                                </div>
                                <div className="table-cell action-cell">
                                    {isEditing ? (
                                        <div className="trade-in-edit-actions">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={handleTradeInValueEditSave}

                                            >
                                                <i className="fas fa-check"></i> Save
                                            </button>
                                            <button
                                                className="btn btn-outline btn-xs"
                                                onClick={handleTradeInValueEditCancel}
                                               
                                            >
                                                <i className="fas fa-times"> Cancel</i>
                                            </button>
                                           </div>
                                           ) : (
                                            <button
                                                className={`btn-select-value ${selectedTradeInValue === item.value ? 'selected' : ''}`}
                                                onClick={() => handleValueSelect(item.value, item.year)}
                                            >
                                                {selectedTradeInValue === item.value ? (
                                                    <>
                                                        <i className="fas fa-check"></i>
                                                        Selected
                                                    </>
                                                ) : (
                                                        <>
                                                            <i className="fas fa-hand-pointer"></i>
                                                            Select
                                                        </>
                                                )}
                                            </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {selectedTradeInValue > 0 && (
                    <div className="selected-value-display">
                        <div className="selected-badge">
                            <i className="fas fa-check-circle"></i>
                            Selected: ${selectedTradeInValue.toLocaleString()}
                        </div>
                    </div>
                )}
            </div>
        );
    };
         

    const LoanSummary = () => {
        return (
            <div className="calculator-card summary-card">
                <div className="card-header">
                    <i className="fas fa-file-invoice-dollar"></i>
                    <h5>Loan Summary</h5>
                </div>
                <div className="simple-summary">
                    <div className="first-payment-display">
                        <div className="payment-label">Monthly Payment</div>
                        <div className="payment-amount">${(application.loan.monthlyPayment || 0).toFixed(2)}</div>
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
                    <h2>Trade-In Application</h2>
                    <div className="step-indicator">
                        <span className={currentStep >= 1 ? 'active' : ''}>1. Vehicle Selection</span>
                        <span className={currentStep >= 2 ? 'active' : ''}>2. Review & Submit</span>
                    </div>
                </div>

                {currentStep === 1 && (
                    <div className="step-content">
                        <div className="step-header">
                            <h3>Select Vehicle Brand & Model</h3>
                            <p>Choose your preferred vehicle and configure your loan terms</p>
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

                                    {/*Editable Price Section */}
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
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => handleCardPriceEditSave(model.id)}
                                                    >
                                                        <i className="fas fa-check"></i> Save
                                                    </button>
                                                    <button
                                                        className="btn btn-outline btn-xs"
                                                        onClick={handleCardPriceEditCancel}
                                                    >
                                                        <i className="fas fa-times"></i> Cancel
                                                    </button>
                                                </div>

                                </div>

                                        ): (

                                                <div
                                        className = "car-model-price editable"
                                        onClick = {
                                            (e) => {
                                                e.stopPropagation();
                                                handleCardPriceEditStart(model.id, model.price);

                                        }}
                                        title= "Click to edit price" 
                                        >
                                         ${model.price.toLocaleString()}
                        <i className="fas fa-edit price-edit-icon"></i>
                                        </div>
                                        )}
                                    </div>
                                    <div className="car-model-price">${(model.price || 0).toLocaleString()}</div>
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
                                    <p>Select your trade-in vehicle and choose a value</p>
                                    <div className="validity-notice">
                                        <i className="fas fa-info-circle"></i>
                                        All trade-in values are valid for 3 months only
                                    </div>
                                </div>
                            </div>

                            {/* Brand Type Selection */}
                            <div className="brand-type-selector">
                                <div className="brand-type-options">
                                    <div
                                        className={`brand-type-option ${supportedTradeInBrands.includes(selectedTradeInBrand) ? 'active' : ''}`}
                                        onClick={() => handleTradeInBrandChange('MG')}
                                    >
                                        <div className="type-icon">
                                            <i className="fas fa-list-alt"></i>
                                        </div>
                                        <div className="type-content">
                                            <h4>Supported Brands</h4>
                                            <p>MG, Maxus, LeapMotors with pre-defined values</p>
                                            <div className="supported-brands-list">
                                                {supportedTradeInBrands.map(brand => (
                                                    <span key={brand} className="supported-brand-tag">{brand}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="type-arrow">
                                            <i className="fas fa-chevron-right"></i>
                                        </div>
                                    </div>

                                    <div
                                        className={`brand-type-option ${!supportedTradeInBrands.includes(selectedTradeInBrand) ? 'active' : ''}`}
                                        onClick={() => handleTradeInBrandChange('Toyota')}
                                    >
                                        <div className="type-icon">
                                            <i className="fas fa-edit"></i>
                                        </div>
                                        <div className="type-content">
                                            <h4>Other Brands</h4>
                                            <p>Toyota, Mazda, Honda, Ford, etc.</p>
                                            <div className="custom-brands-note">
                                                Manual entry required

                                            </div>

                                        </div>
                                        <div className="type-arrow">
                                            <i className="fas fa-chevron-right"></i>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Supported Brands Section */}
                            {supportedTradeInBrands.includes(selectedTradeInBrand) && (
                                <div className="supported-brands-section">
                                    <div className="section-subheader">
                                        <h4>
                                            <i className="fas fa-list-alt"></i>
                                            Supported Brand Trade-In
                                        </h4>
                                        <p>Select from our pre-defined values for {selectedTradeInBrand} vehicles</p>
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
                                            value={application.vehicle.tradeIn?.model || ''}
                                            onChange={(e) => handleModelChange(e.target.value)}
                                            className="modern-select"
                                        >
                                            <option value="">Select Model</option>
                                            {tradeInModels[selectedTradeInBrand].map(model => (
                                                <option key={model} value={model}>{model}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Value Selection Section */}
                                    {application.vehicle.tradeIn?.model && (
                                        <div className="form-group full-width">
                                            <TradeInValueTable />
                                        </div>
                                    )}

                                           
                                    {/* 
                                    <div className="form-group premium-input full-width">
                                        <div className="manual-input-section">
                                            <label className="input-label">
                                                <i className="fas fa-edit"></i>
                                                Or Enter Custom Value
                                            </label>
                                            <div className="manual-input-container">
                                                <div className="input-with-icon">
                                                    <span className="currency-symbol">$</span>
                                                    <input
                                                        type="number"
                                                        value={application.vehicle.tradeIn.manualValue || ''}
                                                        onChange={(e) => handleManualValueChange(e.target.value)}
                                                        className="modern-input"
                                                        min="0"
                                                        max="100000"
                                                        placeholder="Enter custom trade-in value"
                                                    />
                                                    <i className="fas fa-dollar-sign input-icon"></i>
                                                </div>
                                                <button
                                                    className="btn-apply-manual"
                                                    onClick={applyManualValue}
                                                    disabled={!application.vehicle.tradeIn.manualValue}
                                                >
                                                    <i className="fas fa-check"></i>
                                                    Apply Custom Value
                                                </button>
                                            </div>
                                            <div className="input-note">
                                                Use this if your vehicle's year or condition differs from our fixed values
                                            </div>
                                        </div>
                                                </div>
                                    */}
                                </div>
                            </div>
                         </div>
                            )}

                            {/* Other Brands Section */}
                            {!supportedTradeInBrands.includes(selectedTradeInBrand) && (
                                <div className="other-brands-section">
                                    <div className="section-subheader">
                                        <h4>
                                            <i className="fas fa-edit"></i>
                                            Custom Brand Trade-In
                                        </h4>
                                        <p>Enter details for {selectedTradeInBrand} or other vehicle brands</p>
                                    </div>

                                    <div className="trade-in-form-container">
                                        <div className="form-grid">
                                            <div className="form-group premium-input">
                                                <label className="input-label">
                                                    <i className="fas fa-tag"> </i> 
                                                    Vehicle Brand
                                                </label>
                                                <div className="brand-selector-mini">
                                                    {otherTradeInBrands.map(brand => (
                                                        <div 
                                                            key={brand}
                                                            className={`brand-mini-option ${selectedTradeInBrand === brand ? 'active' : ''}`}
                                                            onClick={() => handleTradeInBrandChange(brand)}
                                                        >
                                                            <div className="brand-mini-icon">
                                                                <i className="fas fa-car"></i>
                                                            </div>
                                                            <span>{brand}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="form-group premium-input">
                                                <label className="input-label">
                                                    <i className="fas fa-car"></i>
                                                    Vehicle Model *
                                                </label>
                                                <div className="input-with-icon">
                                                    <input
                                                        type="text"
                                                        value={application.vehicle.tradeIn.model || ''}
                                                        onChange={(e) => handleNestedInputChange('vehicle', 'tradeIn', 'model', e.target.value)}
                                                        className="modern-input"
                                                        placeholder="Enter vehicle model"
                                                        required
                                                    />
                                                    <i className="fas fa-car input-icon"></i>
                                                </div>
                                            </div>

                                            <div className="form-group premium-input">
                                                <label className="input-label">
                                                    <i className="fas fa-calendar"></i>
                                                    Vehicle Year *
                                                </label>
                                                <select
                                                    value={application.vehicle.tradeIn?.year || new Date().getFullYear() - 3}
                                                    onChange={(e) => handleNestedInputChange('vehicle', 'tradeIn', 'year', parseInt(e.target.value))}
                                                    className="modern-select"
                                                    required
                                                >

                                                    <option value="">Select Year</option>
                                                    {Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                        <option key={year} value={year}>{year}</option>
                                                    ))}

                                                </select>
                                            </div>

                                            <div className="form-group premium-input full-width">
                                                <div className="manual-input-section required-section">
                                                    <label className="input-label">
                                                        <i className="fas fa-dollar-sign"></i>
                                                        Trade-in Value *
                                                    </label>
                                                    <div className="manual-input-container">
                                                        <div className="input-with-icon">
                                                            <span className="currency-symbol">$</span>
                                                            <input
                                                                type="number"
                                                                value={application.vehicle.tradeIn?.manualValue || ''}
                                                                onChange={(e) => handleManualValueChange(e.target.value)}
                                                                className="modern-input"
                                                                min="0"
                                                                max="100000"
                                                                placeholder="Enter estimated trade-in value"
                                                                required
                                                            />
                                                            <i className="fas fa-dollar-sign input-icon"></i>
                                                        </div>
                                                        <button
                                                            className="btn-apply-manual"
                                                            onClick={applyManualValue}
                                                            disabled={!application.vehicle.tradeIn?.manualValue || !application.vehicle.tradeIn?.model}
                                                        >
                                                            <i className="fas fa-check"></i>
                                                            Apply Value
                                                        </button>
                                                    </div>
                                                    <div className="input-note">
                                                        Please provide an estimate for your {selectedTradeInBrand} {application.vehicle.tradeIn?.model || ''}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )}

                             
                         

                                {/* Results Display */}
                                {application.vehicle.tradeIn?.estimatedValue > 0 && (
                                    <div className="trade-value-results">
                                        <div className="value-card premium-card">
                                            <div className="value-icon">
                                                <i className="fas fa-dollar-sign"></i>
                                            </div>
                                            <div className="value-content">
                                                <div className="value-label">Estimated Trade-In Value</div>
                                                <div className="value-amount">
                                                    ${(application.vehicle.tradeIn?.estimatedValue || 0).toLocaleString()}
                                                </div>
                                                <div className="value-subtitle">
                                                    {application.vehicle.tradeIn?.valueSource === 'table' ?
                                                        'Fixed value selected from table' :
                                                        'Custom manual value applied'
                                                    }
                                                </div>
                                                <div className="validity-badge">
                                                    <i className="fas fa-clock"></i>
                                                    Valid for 3 months
                                                </div>
                                            </div>
                                            <div className="value-badge">
                                                <i className="fas fa-check-circle"></i>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            
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
                                                ${(application.vehicle.newCar.price || 0).toLocaleString()}
                                            </div>
                                        </div>
                                        {(application.vehicle.tradeIn?.netValue || 0) > 0 && (
                                            <>
                                                <div className="breakdown-item deduction trade-in-highlight">
                                                    <div className="breakdown-label">
                                                        <i className="fas fa-exchange-alt"></i>
                                                        Trade-In Value Applied
                                                    </div>
                                                    <div className="breakdown-value">
                                                        - ${(application.vehicle.tradeIn.netValue || 0).toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="breakdown-item net-price">
                                                    <div className="breakdown-label">
                                                        <strong>Net Vehicle Cost</strong>
                                                    </div>
                                                    <div className="breakdown-value">
                                                        <strong>
                                                            ${((application.vehicle.newCar.price || 0) - (application.vehicle.tradeIn.netValue || 0)).toLocaleString()}
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
                                                - ${(application.loan.downPayment || 0).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="breakdown-divider"></div>
                                        <div className="breakdown-item total-loan">
                                            <div className="breakdown-label">
                                                <strong>Amount to Finance</strong>
                                            </div>
                                            <div className="breakdown-value">
                                                <strong>${(application.loan.loanAmount || 0).toLocaleString()}</strong>
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
                                            <span className="amount">${(application.loan.downPayment || 0).toLocaleString()}</span>
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
                            <p>Your trade-in selection and loan terms are complete. Click below to proceed to the final application review.</p>

                            <div className="summary-grid">
                                <div className="summary-card">
                                    <h4><i className="fas fa-car"></i> New Vehicle</h4>
                                    <div className="summary-item">
                                        <span>Model:</span>
                                        <span>{application.vehicle.newCar.model}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span>Price:</span>
                                        <span>${(application.vehicle.newCar.price || 0 ).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="summary-card">
                                    <h4><i className="fas fa-exchange-alt"></i> Trade-In Vehicle</h4>
                                    <div className="summary-item">
                                        <span>Vehicle:</span>
                                        <span>{application.vehicle.tradeIn.year} {application.vehicle.tradeIn.make} {application.vehicle.tradeIn.model}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span>Trade-In Value:</span>
                                        <span>${(application.vehicle.tradeIn.netValue || 0).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="summary-card">
                                    <h4><i className="fas fa-file-invoice-dollar"></i> Loan Details</h4>
                                    <div className="summary-item">
                                        <span>Loan Amount:</span>
                                        <span>${(application.loan.loanAmount || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span>Monthly Payment:</span>
                                        <span className="payment">${(application.loan.monthlyPayment || 0).toFixed(2)}</span>
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
                            <button className="btn btn-success" onClick={() => {
                                console.log('SENDING APPLICATION DATA TO REVIEW:');
                                console.log('Vehicle Brand:', application.vehicle.brand);
                                console.log('New Car Model:', application.vehicle.newCar.model);
                                console.log('New Car Price:', application.vehicle.newCar.price);
                                console.log('Trade-In Details:', application.vehicle.tradeIn);
                                const applicationData = {
                                    type: 'trade-in',
                                    ...application

                                };
                                navigate('/review/:id', { state: { application: applicationData } })
                            }}>
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
                                    <div className="overview-value">${(application.loan.monthlyPayment || 0).toFixed(2)}</div>
                                </div>
                                <div className="overview-item">
                                    <div className="overview-label">Total Payments</div>
                                    <div className="overview-value">{application.loan.loanTerm} months</div>
                                </div>
                                <div className="overview-item">
                                    <div className="overview-label">Total Interest</div>
                                    <div className="overview-value">${(application.loan.totalInterest || 0).toFixed(2)}</div>
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
                                    <span>${(application.loan.loanAmount || 0).toLocaleString()}</span>
                                </div>
                                <div className="total-item">
                                    <span>Total Interest Paid:</span>
                                    <span>${(application.loan.totalInterest || 0).toFixed(2)}</span>
                                </div>
                                <div className="total-item grand-total">
                                    <span>Total Amount Paid:</span>
                                    <span>${(application.loan.totalCost || 0).toFixed(2)}</span>
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