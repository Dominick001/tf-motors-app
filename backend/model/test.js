import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './ApplicationDetails.css'; // Import the CSS file

const ApplicationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplicationDetails();
    }, [id]);

    const fetchApplicationDetails = async () => {
        try {
            const response = await api.get(`/api/application/${id}`);
            setApplication(response.data.data?.application);
        } catch (error) {
            console.error('Error fetching application details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="application-details-container">
                <div className="application-details-loading">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading application details...</p>
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="application-details-container">
                <div className="application-details-error">
                    <i className="fas fa-exclamation-circle"></i>
                    <h3>Application Not Found</h3>
                    <p>The application you are looking for does not exist or you don't have permission to view it.</p>
                    <button className="application-details-back-btn" onClick={() => navigate('/')}>
                        <i className="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const getStatusClass = (status) => {
        return `application-details-status ${status}`;
    };

    return (
        <div className="application-details-container">
            <div className="application-details-card">
                <div className="application-details-header">
                    <h2>Application Details - {application.applicationId}</h2>
                    <button
                        className="application-details-back-btn"
                        onClick={() => navigate('/')}
                    >
                        <i className="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                </div>

                <div className="application-details-content">
                    {/* Customer Information */}
                    <div className="application-details-section">
                        <h3><i className="fas fa-user"></i> Customer Information</h3>
                        <div className="application-details-grid">
                            <div className="application-details-item">
                                <span className="application-details-label">Full Name:</span>
                                <span className="application-details-value">{application.customerInfo.firstName} {application.customerInfo.lastName}</span>
                            </div>
                            <div className="application-details-item">
                                <span className="application-details-label">Phone:</span>
                                <span className="application-details-value">{application.customerInfo.phone}</span>
                            </div>
                            <div className="application-details-item">
                                <span className="application-details-label">Address:</span>
                                <span className="application-details-value">{application.customerInfo.address}</span>
                            </div>
                            <div className="application-details-item">
                                <span className="application-details-label">City:</span>
                                <span className="application-details-value">{application.customerInfo.city}</span>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="application-details-section">
                        <h3><i className="fas fa-car"></i> Vehicle Information</h3>
                        <div className="application-details-grid">
                            <div className="application-details-item">
                                <span className="application-details-label">Application Type:</span>
                                <span className="application-details-value">{application.applicationType === 'trade-in' ? 'Trade-In' : 'New Car'}</span>
                            </div>
                            <div className="application-details-item">
                                <span className="application-details-label">New Vehicle:</span>
                                <span className="application-details-value">{application.vehicle.brand} {application.vehicle.newCar.model}</span>
                            </div>
                            <div className="application-details-item">
                                <span className="application-details-label">Price:</span>
                                <span className="application-details-value">${application.vehicle.newCar.price.toLocaleString()}</span>
                            </div>

                            {/* Trade-In Details */}
                            {application.applicationType === 'trade-in' && application.vehicle.tradeIn && (
                                <>
                                    <div className="application-details-item">
                                        <span className="application-details-label">Trade-In Vehicle:</span>
                                        <span className="application-details-value">{application.vehicle.tradeIn.year} {application.vehicle.tradeIn.make} {application.vehicle.tradeIn.model}</span>
                                    </div>
                                    <div className="application-details-item">
                                        <span className="application-details-label">Trade-In Value:</span>
                                        <span className="application-details-value">${application.vehicle.tradeIn.estimatedValue.toLocaleString()}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Loan Information */}
                    <div className="application-details-section">
                        <h3><i className="fas fa-file-invoice-dollar"></i> Loan Information</h3>
                        <div className="application-details-grid">
                            <div className="application-details-item">
                                <span className="application-details-label">Loan Amount:</span>
                                <span className="application-details-value">${application.loan.loanAmount.toLocaleString()}</span>
                            </div>
                            <div className="application-details-item">
                                <span className="application-details-label">Down Payment:</span>
                                <span className="application-details-value">${application.loan.downPayment.toLocaleString()} ({application.loan.downPaymentRatio}%)</span>
                            </div>
                            <div className="application-details-item">
                                <span className="application-details-label">Interest Rate:</span>
                                <span className="application-details-value">{application.loan.interestRate}%</span>
                            </div>
                            <div className="application-details-item">
                                <span className="application-details-label">Loan Term:</span>
                                <span className="application-details-value">{application.loan.loanTerm} months ({(application.loan.loanTerm / 12)} years)</span>
                            </div>
                            <div className="application-details-item">
                                <span className="application-details-label">Monthly Payment:</span>
                                <span className="application-details-value">${application.loan.monthlyPayment.toFixed(2)}</span>
                            </div>
                            <div className="application-details-item">
                                <span className="application-details-label">Total Interest:</span>
                                <span className="application-details-value">${application.loan.totalInterest.toFixed(2)}</span>
                            </div>
                            <div className="application-details-item">
                                <span className="application-details-label">Total Cost:</span>
                                <span className="application-details-value">${application.loan.totalCost.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Application Metadata */}
                    <div className="application-details-section">
                        <h3><i className="fas fa-info-circle"></i> Application Details</h3>
                        <div className="application-details-grid">
                            <div className="application-details-item">
                                <span className="application-details-label">Status:</span>
                                <span className={getStatusClass(application.status)}>
                                    {application.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                            <div className="application-details-item">
                                <span className="application-details-label">Application Date:</span>
                                <span className="application-details-value">{new Date(application.applicationDate).toLocaleDateString()}</span>
                            </div>
                            <div className="application-details-item">
                                <span className="application-details-label">First Payment Date:</span>
                                <span className="application-details-value">{new Date(application.firstPaymentDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetails;