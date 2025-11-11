import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('overview');
    const [error, setError] = useState('');
    const [timeFilter, setTimeFilter] = useState('all');
    const [salesPersonFilter, setSalesPersonFilter] = useState('all');


    // Add timeFilter and salesPersonFilter to useEffect dependencies
    useEffect(() => {
        fetchDashboardData();
    }, [filter, timeFilter, salesPersonFilter]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const params = new URLSearchParams();
            if (filter !== 'all') params.append('status', filter);
            if (timeFilter !== 'all') params.append('time', timeFilter);
            if (salesPersonFilter !== 'all' && (user?.role === 'manager' || user?.role === 'admin')) {
                params.append('salesPerson', salesPersonFilter);
            }

            console.log('Fetching applications from /api/applications...');

            // Fetch applications
            const applicationsResponse = await api.get(`/api/applications?${params.toString()}`);
            console.log('Applications response:', applicationsResponse.data);

            const applicationsData = applicationsResponse.data.data?.applications || [];
            console.log('Applications data:', applicationsData);
            setApplications(applicationsData);

            // Fetch dashboard stats
            try {
                const statsResponse = await api.get(`/api/applications/dashboard/stats?${params.toString()}`);
                console.log('Stats response:', statsResponse.data);

                const statsData = statsResponse.data.data?.overview || {};
                setStats(statsData);

            } catch (statsError) {
                console.log('Stats endpoint not available, calculating from applications data');
                // Calculate basic stats from applications data with safe access
                const calculatedStats = {
                    totalApplications: applicationsData.length,
                    totalLoanAmount: applicationsData.reduce((sum, app) => sum + (app.loan?.loanAmount || 0), 0),
                    newCarApplications: applicationsData.filter(app => app.applicationType === 'new-car').length,
                    tradeInApplications: applicationsData.filter(app => app.applicationType === 'trade-in').length
                };
                setStats(calculatedStats);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'submitted': return 'status-submitted';
            default: return 'status-draft';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'submitted': return 'Submitted';
            default: return status;
        }
    };

    const getApplicationTypeText = (type) => {
        return type === 'new-car' ? 'New Car' : 'Trade-In';
    };

    const formatCurrency = (amount) => {
        if (!amount || isNaN(amount)) return '$0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Safe data access functions - UPDATED for TradeInApplication data structure
    const getVehicleModel = (application) => {
        return application?.vehicle?.newCar?.model || 'N/A';
    };

    const getVehicleBrand = (application) => {
        return application?.vehicle?.newCar?.brand || application?.vehicle?.brand || 'N/A';
    };

    // Add missing getVehiclePrice function
    const getVehiclePrice = (application) => {
        return application?.vehicle?.newCar?.price || 0;
    };

    const getTradeInValue = (application) => {
        if (application?.applicationType === 'trade-in') {
            return application?.vehicle?.tradeIn?.estimatedValue ||
                application?.vehicle?.tradeIn?.netValue ||
                application?.tradeInDetails?.estimatedValue || 0;
        }
        return 0;
    };

    // Get trade-in vehicle details for display
    const getTradeInVehicleDetails = (application) => {
        if (application?.applicationType === 'trade-in') {
            // Use tradeInDetails directly since that's where your data is stored
            if (application?.tradeInDetails) {
                return {
                    year: application.tradeInDetails.selectedYear,
                    brand: application.tradeInDetails.selectedBrand,
                    model: application.tradeInDetails.selectedModel,
                    value: application?.vehicle?.tradeIn?.estimatedValue ||
                        application?.vehicle?.tradeIn?.netValue || 0
                };
            }
        }
        return null;
    };

    const getLoanAmount = (application) => {
        return application?.loan?.loanAmount || 0;
    };

    const getMonthlyPayment = (application) => {
        return application?.loan?.monthlyPayment || 0;
    };

    const getCustomerName = (application) => {
        const firstName = application?.customerInfo?.firstName || '';
        const lastName = application?.customerInfo?.lastName || '';
        return `${firstName} ${lastName}`.trim() || 'N/A';
    };

    const getCustomerPhone = (application) => {
        return application?.customerInfo?.phone || 'N/A';
    };

    // Get unique sales persons for manager filter
    const uniqueSalesPersons = [...new Set(
        applications
            .filter(app => app.salesPerson && app.salesPerson._id)
            .map(app => app.salesPerson._id)
    )];

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-title">
                        <i className="fas fa-tachometer-alt"></i>
                        <h1>TF Motors Dashboard</h1>
                        <span className="user-role-badge">{user?.role}</span>
                    </div>
                    <div className="user-info">
                        <div className="user-details">
                            <i className="fas fa-user-circle"></i>
                            <div className="user-text">
                                <span className="welcome">Welcome back,</span>
                                <span className="user-name">{user?.name}</span>
                                <span className="user-role">{user?.role}</span>
                            </div>
                        </div>
                        <button className="btn-logout" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="error-banner">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="btn-close-error">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="dashboard-tabs">
                <button
                    className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <i className="fas fa-chart-pie"></i>
                    Overview
                </button>
                <button
                    className={`tab-button ${activeTab === 'applications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('applications')}
                >
                    <i className="fas fa-file-alt"></i>
                    Applications
                </button>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                    <Link to="/users" className="tab-button">
                        <i className="fas fa-users-cog"></i>
                        User Management
                    </Link>
                )}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="overview-tab">
                    {/* Quick Actions for Sales */}
                    {(user?.role === 'sales' || user?.role === 'admin' || user?.role === 'manager') && (
                        <div className="quick-actions-section">
                            <div className="section-header">
                                <h2><i className="fas fa-bolt"></i> Quick Actions</h2>
                                <p>Start a new loan application</p>
                            </div>
                            <div className="action-cards">
                                <Link to="/new-car" className="action-card new-car">
                                    <div className="card-icon">
                                        <i className="fas fa-car-side"></i>
                                    </div>
                                    <div className="card-content">
                                        <h3>New Car Application</h3>
                                        <p>Create application for new vehicle purchase</p>
                                    </div>
                                    <div className="card-arrow">
                                        <i className="fas fa-chevron-right"></i>
                                    </div>
                                </Link>

                                <Link to="/trade-in" className="action-card trade-in">
                                    <div className="card-icon">
                                        <i className="fas fa-exchange-alt"></i>
                                    </div>
                                    <div className="card-content">
                                        <h3>Trade-In Application</h3>
                                        <p>Create application with vehicle trade-in</p>
                                    </div>
                                    <div className="card-arrow">
                                        <i className="fas fa-chevron-right"></i>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Statistics */}
                    <div className="stats-section">
                        <div className="section-header">
                            <h2><i className="fas fa-chart-bar"></i> Application Overview</h2>
                            {/* 
                            <div className="filter-controls">
                                <select
                                    value={timeFilter}
                                    onChange={(e) => setTimeFilter(e.target.value)}
                                    className="time-select"
                                >
                                    <option value="all">All Time</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                </select>
                                {(user?.role === 'manager' || user?.role === 'admin') && (
                                    <select
                                        value={salesPersonFilter}
                                        onChange={(e) => setSalesPersonFilter(e.target.value)}
                                        className="salesperson-select"
                                    >
                                        <option value="all">All Salespersons</option>
                                        {uniqueSalesPersons.map(salesPersonId => {
                                            const app = applications.find(a => a.salesPerson?._id === salesPersonId);
                                            return app?.salesPerson ? (
                                                <option key={salesPersonId} value={salesPersonId}>
                                                    {app.salesPerson.name}
                                                </option>
                                            ) : null;
                                        })}
                                    </select>
                                )}
                            </div>
                            */}
                        </div>
                        <div className="stats-grid">
                            <div className="stat-card total">
                                <div className="stat-icon">
                                    <i className="fas fa-file-alt"></i>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value">{stats.totalApplications || 0}</div>
                                    <div className="stat-label">Total Applications</div>
                                    <div className="stat-subtitle">
                                        {stats.newCarApplications || 0} New Car • {stats.tradeInApplications || 0} Trade-In
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card revenue">
                                <div className="stat-icon">
                                    <i className="fas fa-dollar-sign"></i>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value">{formatCurrency(stats.totalLoanAmount || 0)}</div>
                                    <div className="stat-label">Total Loan Amount</div>
                                    <div className="stat-subtitle">All applications</div>
                                </div>
                            </div>

                            <div className="stat-card average">
                                <div className="stat-icon">
                                    <i className="fas fa-calculator"></i>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value">
                                        {formatCurrency(
                                            stats.totalApplications > 0
                                                ? (stats.totalLoanAmount || 0) / stats.totalApplications
                                                : 0
                                        )}
                                    </div>
                                    <div className="stat-label">Average Loan</div>
                                    <div className="stat-subtitle">Per application</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
                <div className="applications-tab">
                    <div className="applications-section">
                        <div className="section-header">
                            <div className="section-title">
                                <h2><i className="fas fa-list"></i> Applications</h2>
                                <span className="app-count">{applications.length} applications</span>
                            </div>
                            <div className="filter-controls">
                                <div className="filter-group">
                                    <label>Time Period:</label>
                                    <select
                                        value={timeFilter}
                                        onChange={(e) => setTimeFilter(e.target.value)}
                                    >
                                        <option value="all">All Time</option>
                                        <option value="week">This Week</option>
                                        <option value="month">This Month</option>
                                    </select>
                                </div>
                                {(user?.role === 'manager' || user?.role === 'admin') && (
                                    <div className="filter-group">
                                        <label>Salesperson:</label>
                                        <select
                                            value={salesPersonFilter}
                                            onChange={(e) => setSalesPersonFilter(e.target.value)}
                                        >
                                            <option value="all">All Salespersons</option>
                                            {uniqueSalesPersons.map(salesPersonId => {
                                                const app = applications.find(a => a.salesPerson?._id === salesPersonId);
                                                return app?.salesPerson ? (
                                                    <option key={salesPersonId} value={salesPersonId}>
                                                        {app.salesPerson.name}
                                                    </option>
                                                ) : null;
                                            })}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-state">
                                <i className="fas fa-spinner fa-spin"></i>
                                <p>Loading applications...</p>
                            </div>
                        ) : (
                            <div className="applications-grid">
                                {applications.length === 0 ? (
                                    <div className="empty-state">
                                        <i className="fas fa-folder-open"></i>
                                        <h3>No applications found</h3>
                                        <p>There are no applications matching your current filters.</p>
                                        {(user?.role === 'sales' || user?.role === 'admin' || user?.role === 'manager') && (
                                            <div className="empty-state-actions">
                                                <Link to="/new-car" className="btn btn-primary">
                                                    <i className="fas fa-plus"></i>
                                                    New Car Application
                                                </Link>
                                                <Link to="/trade-in" className="btn btn-outline">
                                                    <i className="fas fa-exchange-alt"></i>
                                                    Trade-In Application
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                            applications.map(application => {
                                                console.log('=== DASHBOARD DEBUG ===');
                                                console.log('Application:', application);
                                                console.log('Vehicle brand:', application?.vehicle?.brand);
                                                console.log('New Car model:', application?.vehicle?.newCar?.model);
                                                console.log('New Car price:', application?.vehicle?.newCar?.price);
                                                console.log('Trade-In:', application?.vehicle?.tradeIn);

                                        const tradeInDetails = getTradeInVehicleDetails(application);

                                        return (
                                            <div key={application._id} className="application-card">
                                                <div className="application-header">
                                                    <div className="app-info">
                                                        <div className="app-number">#{application.applicationId || 'N/A'}</div>
                                                        <div className="app-date">
                                                            {formatDate(application.applicationDate)}
                                                        </div>
                                                    </div>
                                                    <div className="app-type-badge">
                                                        {getApplicationTypeText(application.applicationType)}
                                                    </div>
                                                    <div className={`status-badge ${getStatusColor(application.status)}`}>
                                                        {getStatusText(application.status)}
                                                    </div>
                                                </div>

                                                <div className="application-body">
                                                    <div className="customer-section">
                                                        <div className="customer-avatar">
                                                            <i className="fas fa-user"></i>
                                                        </div>
                                                        <div className="customer-details">
                                                            <h4>{getCustomerName(application)}</h4>
                                                            <div className="contact-info">
                                                                <span><i className="fas fa-phone"></i> {getCustomerPhone(application)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="application-details">
                                                        <div className="detail-item">
                                                            <i className="fas fa-car"></i>
                                                            <div>
                                                                <label>Vehicle</label>
                                                                <span>
                                                                    {/* FIXED: New Vehicle Information - Direct access */}
                                                                    <div style={{ marginBottom: '5px' }}>
                                                                        <strong>
                                                                            {application?.applicationType === 'trade-in' ? 'New: ' : ''}
                                                                            {application?.vehicle?.brand || 'N/A'} {application?.vehicle?.newCar?.model || 'N/A'}
                                                                        </strong>
                                                                        {application?.vehicle?.newCar?.price > 0 && (
                                                                            <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '5px' }}>
                                                                                ({formatCurrency(application.vehicle.newCar.price)})
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {/* Trade-In Information - direct access */}
                                                                    {application?.applicationType === 'trade-in' && application?.vehicle?.tradeIn && (
                                                                        <div style={{ fontSize: '0.8em', color: '#059669', padding: '3px 0' }}>
                                                                            <i className="fas fa-exchange-alt" style={{ marginRight: '3px' }}></i>
                                                                            Trade-In: {application.vehicle.tradeIn.year} {application.vehicle.tradeIn.make} {application.vehicle.tradeIn.model}
                                                                            {application.vehicle.tradeIn.estimatedValue > 0 && (
                                                                                <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>
                                                                                    (Value: {formatCurrency(application.vehicle.tradeIn.estimatedValue)})
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item">
                                                            <i className="fas fa-file-invoice-dollar"></i>
                                                            <div>
                                                                <label>Loan Amount</label>
                                                                <span>{formatCurrency(getLoanAmount(application))}</span>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item">
                                                            <i className="fas fa-money-bill-wave"></i>
                                                            <div>
                                                                <label>Monthly Payment</label>
                                                                <span>{formatCurrency(getMonthlyPayment(application))}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {(user?.role === 'manager' || user?.role === 'admin') && (
                                                        <div className="sales-info">
                                                            <i className="fas fa-user-tie"></i>
                                                            <span>Sales: {application.salesPerson?.name || 'N/A'}</span>
                                                        </div>
                                                    )}

                                                    <div className="application-footer">
                                                        <button
                                                            className="btn-view"
                                                            onClick={() => navigate(`/application/${application._id}`)}
                                                        >
                                                            View Details <i className="fas fa-arrow-right"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;