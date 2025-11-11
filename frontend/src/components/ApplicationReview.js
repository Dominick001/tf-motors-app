import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../services/api';


const ApplicationReview = () => { 
    const location = useLocation();
    const navigate = useNavigate();
    const { application } = location.state || {};
    const pdfRef = useRef();

    const [customerInfo, setCustomerInfo] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: ''
    });

    //Determine application type
    const applicationType = application?.type || 'new-car'; //default to new-car

    const handleCustomerInfoChange = (field, value) => {
        setCustomerInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const generatePDF = async () => {
        const element = pdfRef.current;

        const originalStyles = {
            width: element.style.width,
            minHeight: element.style.minHeight,
            background: element.style.background,
            position: element.style.position,
            overflow: element.style.overflow
        };

        element.style.width = '210mm';
        element.style.minHeight = 'auto';
        element.style.background = 'white';
        element.style.position = 'static';
        element.style.overflow = 'visible';

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                scrollX: 0,
                scrollY: -window.scrollY,
                windowWidth: document.documentElement.scrollWidth,
                windowHeight: document.documentElement.scrollHeight,
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.querySelector('.pdf-container');
                    if (clonedElement) {
                        clonedElement.style.width = '210mm';
                        clonedElement.style.minHeight = 'auto';
                        clonedElement.style.background = 'white';
                        clonedElement.style.overflow = 'visible';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let position = 0;
            const pageHeight = 297;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            let heightLeft = imgHeight - pageHeight;


            // Add new pages if content is longer than one page
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`TF-Motors-${applicationType === 'trade-in' ? 'Trade-In' : 'New-Car'}-Summary-${customerInfo.firstName || 'Customer'}.pdf`);

        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            Object.keys(originalStyles).forEach(key => {
                element.style[key] = originalStyles[key];
            });
        }
       
    };

    const handleSubmit = async () => {
        try {
            /*
            console.log('=== BEFORE SUBMISSION DEBUG ===');
            console.log('Application data to be saved:', application);
            console.log('Vehicle brand in submission:', application?.vehicle?.brand);
            console.log('New car model in submission:', application?.vehicle?.newCar?.model);
            */
            // Validate required fields
            if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.phone) {
                alert('Please fill in all required customer information');
                return;
            }

            // Prepare the application data for the backend
            const applicationData = {
                applicationType: applicationType,
                customerInfo: {
                    firstName: customerInfo.firstName,
                    lastName: customerInfo.lastName,
                    phone: customerInfo.phone,
                    address: customerInfo.address || '',
                    city: customerInfo.city || ''
                },
                vehicle: {
                    type: applicationType === 'trade-in' ? 'trade-in' : 'new',
                    brand: application.vehicle.brand, 
                    newCar: {
                        model: application.vehicle.newCar.model, 
                        price: application.vehicle.newCar.price, 
                        brand: application.vehicle.brand 
                    },
                    tradeIn: applicationType === 'trade-in' ? {
                        year: application.vehicle.tradeIn.year,
                        make: application.vehicle.tradeIn.make,
                        model: application.vehicle.tradeIn.model,
                        estimatedValue: application.vehicle.tradeIn.estimatedValue,
                        netValue: application.vehicle.tradeIn.estimatedValue,
                        valueSource: application.vehicle.tradeIn.valueSource 
                    } : null
                },
                loan: {
                    loanAmount: application.loan.loanAmount,
                    downPayment: application.loan.downPayment,
                    downPaymentRatio: application.loan.downPaymentRatio,
                    interestRate: application.loan.interestRate,
                    loanTerm: application.loan.loanTerm,
                    monthlyPayment: application.loan.monthlyPayment,
                    totalInterest: application.loan.totalInterest,
                    totalCost: application.loan.totalCost,
                    amortizationSchedule: application.loan.amortizationSchedule || []
                },
                tradeInDetails: applicationType === 'trade-in' ? {
                    selectedBrand: application.vehicle.tradeIn.make,
                    selectedModel: application.vehicle.tradeIn.model,
                    selectedYear: application.vehicle.tradeIn.year,
                    valueSource: application.vehicle.tradeIn.valueSource || 'table'
                } : null,
                notes: `Application submitted on ${new Date().toLocaleDateString()}`,
                status: 'submitted',
                applicationDate: new Date().toISOString() // Add application date
            };
            console.log('COMPLETE VEHICLE DATA:', {
                brand: application.vehicle.brand,
                newCar: application.vehicle.newCar,
                tradeIn: application.vehicle.tradeIn
            });
            

            // Make API call to save the application
            const response = await api.post('/api/applications', applicationData);

            // Add this debug to see what was actually saved
            console.log('API RESPONSE:', response.data);
            console.log('SAVED APPLICATION DATA:', response.data.data?.application);

            if (response.data.status === 'success') {
                alert('Application submitted successfully!');
            
                await generatePDF();

                // Redirect to dashboard
                navigate('/');
            } else {
                alert('Failed to submit application: ' + response.data.message);
            }

        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Error submitting application: ' + (error.response?.data?.message || error.message));
        }
    };

    if (!application) {
        return (
            <div className="application-container">
                <div className="card">
                    <div className="card-header">
                        <h2>Application Summary</h2>

                    </div>
                    <div className="step-content">
                        <p>No application data found. Please start from the beginning</p>
                        <button className="btn btn-outline" onClick={() => navigate('/')}>
                            Back to Home

                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const fullName = `${customerInfo.firstName} ${customerInfo.lastName}`.trim();
    const applicationId = `TF-${applicationType === 'trade-in' ? 'TI' : 'NC'}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const applicationDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const firstPaymentDate = new Date();
    firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
    const firstPaymentFormatted = firstPaymentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric' 
    });

    return (
        <div className="application-container">
            <div className="card">
                <div className="card-header">
                    <h2>
                        {applicationType === 'trade-in' ? 'Trade-In' : 'New Car'} Application Summary
                    </h2>
                    <div className="step-indicator">
                        <span>1. {application === 'trade-in' ? 'Trade-In Selection' : 'Vehicle Selection'}</span>
                        <span className="active">2. Review & Submit</span>
                    </div>
                </div>

                <div className="step-content">
                    <div className="customer-form-section">
                        <h3><i className="fas fa-user"></i> Customer Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name *</label>
                                <input
                                    type="text"
                                    value={customerInfo.firstName}
                                    onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                                    className="modern-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input
                                    type="text"
                                    value={customerInfo.lastName}
                                    onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                                    className="modern-input"
                                    required
                                />

                            </div>

                            <div className="form-group">
                                <label>Phone *</label>
                                <input
                                    type="tel"
                                    value={customerInfo.phone}
                                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                                    className="modern-input"
                                    required
                                />

                            </div>

                            <div className="form-group full-width">
                                <label>Address</label>
                                <input
                                    type="text"
                                    value={customerInfo.address}
                                    onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                                    className="modern-input"
                                    placeholder="Street Address"
                                />

                            </div>

                            <div className="form-group">
                                <label>City/Province</label>
                                <input
                                    type="text"
                                    value={customerInfo.city}
                                    onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                                    className="modern-input"
                                />

                            </div>

                        </div>
                    </div>
                </div>

                {/* Application Summary Preview */}
                <div className="summary-preview-section">
                    <h3><i className="fas fa-file-alt"></i> Application Summary</h3>
                    <div className="preview-content">
                        {applicationType === 'trade-in' ? (
                            <div className="trade-in-summary">
                                <h4>Trade-In Application</h4>
                                <p><strong>New Vehicle:</strong> {application.vehicle.newCar.model}</p>
                                <p><strong>Trade-In Vehicle:</strong> {application.vehicle.tradeIn.year} {application.vehicle.tradeIn.make} {application.vehicle.tradeIn.model}</p>
                                <p><strong>Trade-In Value:</strong> {(application.vehicle.tradeIn.estimatedValue || 0).toLocaleString()}</p>
                                <p><strong>Monthly Payment:</strong> {(application.loan.monthlyPayment || 0).toFixed(2)}</p>

                            </div>
                        ) : (
                            <div className="new-car-summary">
                                <h4>New Car Application</h4>
                                <p><strong>Vehicle:</strong> {application.vehicle.newCar.model}</p>
                                <p><strong>Price:</strong> ${(application.vehicle.newCar.price || 0).toLocaleString()}</p>
                                <p><strong>Monthly Payment:</strong> ${(application.loan.monthlyPayment || 0).toFixed(2)}</p>

                            </div>

                        )}
                    </div>

                </div>

                {/* PDF Template Preview */}
                <div className="pdf-preview-section">
                    <h3><i className="fas fa-file-pdf"></i>TF Motors Loan Summary Preview</h3>
                    <div className="pdf-container" ref={pdfRef}>
                        <div className="tf-motors-doc">
                            <div className="header">
                                <div className="logo-pdf" style={{background: 'transparent', border: 'none'}}>
                                    <img src="/images/logo/tflogo.jpg" alt="TF Motors Logo" className="logo-img" />
                                </div>
                                <div className="title-area">
                                    <div className="company-name-kh">ក្រុមហ៊ុន ធីអេហ្វ ម៉ូធ័រ (ខេមបូឌា)</div>
                                    <div className="company-name-en">TF Motors (Cambodia)</div>
                                    <div className="company-address"> <p>អាគារ ១៧៤-១៧៥ (ប្លុក ១C, ១D​ និង ២C, ២D) នៃកាលីហ្វ័រញ៉ា សូសលហៅស៍ ផ្លូវ​ សហព័ន្ធរុស្សី សង្កាត់ ទឹកថ្លា ខណ្ឌ សែនសុខ រាជធានីភ្នំពេញ
                                        Tel +855 77900 905/ +855 77 763 616 </p></div>
                                </div>
                                <div className="app-info">
                                    ID: {applicationId}<br />{applicationDate}
                                </div>

                            </div>

                            <div className="content">
                                <div className="section">
                                    <div className="section-title">
                                        <span className="section-title-kh">ព័ត៌មានអតិថិជន</span>
                                        <span className="section-title-en">Customer Information</span>
                                    </div>
                                    <table>
                                    <tbody>
                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">ឈ្មោះពេញ</span>
                                                <span className="label-en">Full Name</span>
                                            </td>
                                            <td className="value">{fullName || 'Customer Name'}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">លេខទូរស័ព្ទ</span>
                                                <span className="label-en">Phone Number</span>

                                            </td>
                                            <td className="value">{customerInfo.phone || '(555) 123-4567'} </td>
                                        </tr>

                                        </tbody>
                                    </table>
                                </div>

                                {/* Vehicle Details */}
                                <div className="section">
                                    <div className="section-title">
                                        <span className="section-title-kh">ព័ត៌មានរថយន្ត</span>
                                        <span className="section-title-en">Vehicle Details</span>
                                    </div>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">រថយន្តថ្មី</span>
                                                <span className="label-en">New Vehicle</span>
                                            </td>
                                            <td className="value">{application.vehicle.newCar.model}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">ម៉ាក</span>
                                                <span className="label-en">Brand</span>
                                            </td>
                                            <td className="value">{application.vehicle.brand}</td>
                                            </tr>

                                            {/* SHOW NEW VEHICLE PRICE ONLY FOR TRADE-IN APPLICATIONS */}
                                            {applicationType === 'trade-in' && (
                                                <tr>
                                                    <td className="label">
                                                        <span className="label-kh">តម្លៃរថយន្តថ្មី</span>
                                                        <span className="label-en">New Vehicle Price</span>
                                                    </td>
                                                    <td className="value">${(application.vehicle.newCar.price || 0).toLocaleString()}</td>
                                                </tr>
                                            )}

                                        {/* Trade-In Vehicle - Only show if trade-in exists */}
                                        {applicationType === 'trade-in' && application.vehicle.tradeIn?.estimatedValue > 0 && (
                                            <>
                                                <tr>
                                                    <td className="label" style={{ background: '#f0f9ff' }}>
                                                        <span className="label-kh">រថយន្ត Trade-In</span>
                                                        <span className="label-en">Trade-In Vehicle</span>
                                                    </td>
                                                    <td className="value" style={{ background: '#f0f9ff' }}>
                                                        {application.vehicle.tradeIn.year} {application.vehicle.tradeIn.make} {application.vehicle.tradeIn.model}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="label" style={{ background: '#f0f9ff' }}>
                                                        <span className="label-kh">តម្លៃ Trade-In</span>
                                                        <span className="label-en">Trade-In Value</span>
                                                    </td>
                                                    <td className="value" style={{ background: '#f0f9ff', color: '#059669', fontWeight: '700' }}>
                                                        - ${(application.vehicle.tradeIn.estimatedValue || 0).toLocaleString()}
                                                    </td>
                                                </tr>
                                            </>
                                        )}

                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">តម្លៃរថយន្តសរុប</span>
                                                <span className="label-en">
                                                    {applicationType === 'trade-in' ? 'Net Vehicle Cost' : 'Total Vehicle Price'}
                                                </span>
                                            </td>
                                            <td className="value highlight">
                                                ${applicationType === 'trade-in' ?
                                                    ((application.vehicle.newCar.price || 0) - (application.vehicle.tradeIn?.estimatedValue || 0)).toLocaleString() :
                                                    (application.vehicle.newCar.price || 0).toLocaleString()
                                                }
                                            </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/*Loan Details */}
                                <div className="section">
                                    <div className="section-title">
                                        <span className="section-title-kh">ព័ត៌មានកម្ចី</span>
                                        <span className="section-title-en">Loan Details</span>
                                    </div>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">ចំនួនកម្ចី</span>
                                                <span className="label-en">Loan Amount</span>
                                            </td>
                                            <td className="value">${(application.loan.loanAmount || 0).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">ការទូទាត់មុន</span>
                                                <span className="label-en">Down Payment</span>
                                            </td>
                                            <td className="value">${(application.loan.downPayment || 0).toLocaleString()} ({application.loan.downPaymentRatio}%)</td>
                                        </tr>
                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">អត្រាការប្រាក់</span>
                                                <span className="label-en">Interest Rate</span>
                                            </td>
                                            <td className="value">{application.loan.interestRate}%</td>
                                        </tr>
                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">រយៈពេលកម្ចី</span>
                                                <span className="label-en">Loan Term</span>
                                            </td>
                                            <td className="value">{application.loan.loanTerm} months ({(application.loan.loanTerm / 12)} years)</td>
                                        </tr>
                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">ការប្រាក់សរុប</span>
                                                <span className="label-en">Total Interest</span>
                                            </td>
                                            <td className="value">${(application.loan.totalInterest || 0).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">ការសងសរុប</span>
                                                <span className="label-en">Total Repayment</span>
                                            </td>
                                            <td className="value highlight">${(application.loan.totalCost || 0).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/*Payment Schedule */}
                                <div className="section">
                                    <div className="section-title">
                                        <span className="section-title-kh">កាលវិភាគការទូទាត់</span>
                                        <span className="section-title-en">Payment Schedule</span>
                                    </div>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">កាលបរិច្ឆេទទូទាត់ដំបូង</span>
                                                <span className="label-en">First Payment</span>
                                            </td>
                                            <td className="value">{firstPaymentFormatted}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">ប្រេកង់ការទូទាត់</span>
                                                <span className="label-en">Payment Frequency</span>
                                            </td>
                                            <td className="value">Monthly</td>
                                            </tr>
                                            {/* 
                                        <tr>
                                            <td className="label">
                                                <span className="label-kh">ចំនួនការទូទាត់សរុប</span>
                                                <span className="label-en">Total Payments</span>
                                            </td>
                                            <td className="value">{application.loan.loanTerm} payments</td>
                                            </tr>
                                            */}
                                        </tbody>
                                    </table>
                                </div>

                                {/*Estimated Monthly Payment */}
                                <div className="payment-section">
                                    <div className="payment-label-kh">ការទូទាត់ប្រចាំខែប៉ាន់ស្មាន</div>
                                    <div className="payment-label-en">Estimated Monthly Payment </div>
                                    <div className="payment-amount">${(application.loan.monthlyPayment || 0).toFixed(2)}</div>
                                </div>
                            </div>

                            {/*Footer */}
                            <div className="footer">
                                <div className="footer-kh">ការប៉ាន់ស្មាននេះមានសុពលភាពរយៈពេល ៣០ថ្ងៃចាប់ពីថ្ងៃដាក់ពាក្យ</div>
                                <div className="footer-en">This quotation is valid for 30 days from the application date. </div>
                                <p>Contact: seang.panha@tfmotors.com.kh | 012 78 88 17</p>
                            </div>
                        </div>
                    </div>
             
                </div>

                {/* Add Action Buttons */}
                <div className="action-buttons">
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate(-1)}
                    >
                        <i className="fas fa-arrow-left"></i> Back
                    </button>

                    <div className="right-buttons">
                        <button
                            className="btn btn-secondary"
                            onClick={generatePDF}
                            disabled={!customerInfo.firstName || !customerInfo.lastName}
                        >
                            <i className="fas fa-download"></i> Export to PDF
                        </button>

                        <button
                            className="btn btn-success"
                            onClick={handleSubmit}
                            disabled={!customerInfo.firstName || !customerInfo.lastName || !customerInfo.phone}
                        >
                            <i className="fas fa-paper-plane"></i> Submit Application
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default ApplicationReview;