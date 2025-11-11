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
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'applications'

    useEffect(() => {
        fetchDashboardData();
    }, [filter]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch applications with current filter
            const applicationsResponse = await api.get(`/applications?status=${filter === 'all' ? '' : filter}`);
            setApplications(applicationsResponse.data.data.applications);

            // Fetch dashboard stats
            const statsResponse = await api.get('/applications/dashboard/stats');
            setStats(statsResponse.data.data.overview);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
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
            case 'approved': return 'status-approved';
            case 'rejected': return 'status-rejected';
            case 'submitted': return 'status-submitted';
            case 'under_review': return 'status-review';
            case 'draft': return 'status-draft';
            default: return 'status-draft';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'approved': return 'Approved';
            case 'rejected': return 'Rejected';
            case 'submitted': return 'Pending Review';
            case 'under_review': return 'Under Review';
            case 'draft': return 'Draft';
            default: return status;
        }
    };

    const getApplicationTypeText = (type) => {
        return type === 'new-car' ? 'New Car' : 'Trade-In';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

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
                    {user?.role === 'sales' && (
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
                            <div className="time-filter">
                                <span>All Time</span>
                            </div>
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

                            <div className="stat-card pending">
                                <div className="stat-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value">{stats.submittedApplications || 0}</div>
                                    <div className="stat-label">Pending Review</div>
                                    <div className="stat-subtitle">Awaiting approval</div>
                                </div>
                            </div>

                            <div className="stat-card approved">
                                <div className="stat-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value">{stats.approvedApplications || 0}</div>
                                    <div className="stat-label">Approved</div>
                                    <div className="stat-subtitle">Successful applications</div>
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
                        </div>

                        {/* Additional stats for managers/admins */}
                        {(user?.role === 'manager' || user?.role === 'admin') && (
                            <div className="additional-stats">
                                <div className="stat-item">
                                    <span className="stat-item-label">Under Review</span>
                                    <span className="stat-item-value">{stats.underReviewApplications || 0}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-item-label">Rejected</span>
                                    <span className="stat-item-value">{stats.rejectedApplications || 0}</span>
                                </div>
                            </div>
                        )}
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
                            <div className="filter-tabs">
                                <button
                                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilter('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={`filter-tab ${filter === 'submitted' ? 'active' : ''}`}
                                    onClick={() => setFilter('submitted')}
                                >
                                    Pending
                                </button>
                                <button
                                    className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
                                    onClick={() => setFilter('approved')}
                                >
                                    Approved
                                </button>
                                <button
                                    className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
                                    onClick={() => setFilter('rejected')}
                                >
                                    Rejected
                                </button>
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
                                        <p>There are no applications matching your current filter.</p>
                                        {user?.role === 'sales' && (
                                            <Link to="/new-car" className="btn btn-primary">
                                                <i className="fas fa-plus"></i>
                                                Create Your First Application
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    applications.map(application => (
                                        <div key={application._id} className="application-card">
                                            <div className="application-header">
                                                <div className="app-info">
                                                    <div className="app-number">#{application.applicationId}</div>
                                                    <div className="app-date">
                                                        {new Date(application.applicationDate).toLocaleDateString()}
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
                                                        <h4>{application.customerInfo.firstName} {application.customerInfo.lastName}</h4>
                                                        <div className="contact-info">
                                                            <span><i className="fas fa-phone"></i> {application.customerInfo.phone}</span>
                                                            {application.customerInfo.email && (
                                                                <span><i className="fas fa-envelope"></i> {application.customerInfo.email}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="application-details">
                                                    <div className="detail-item">
                                                        <i className="fas fa-car"></i>
                                                        <div>
                                                            <label>Vehicle</label>
                                                            <span>{application.vehicle.newCar.model}</span>
                                                        </div>
                                                    </div>
                                                    <div className="detail-item">
                                                        <i className="fas fa-file-invoice-dollar"></i>
                                                        <div>
                                                            <label>Loan Amount</label>
                                                            <span>{formatCurrency(application.loan.loanAmount)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="detail-item">
                                                        <i className="fas fa-money-bill-wave"></i>
                                                        <div>
                                                            <label>Monthly Payment</label>
                                                            <span>{formatCurrency(application.loan.monthlyPayment)}</span>
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
                                                    {(user?.role === 'manager' || user?.role === 'admin') && application.status === 'submitted' && (
                                                        <div className="manager-actions">
                                                            <button className="btn-approve">
                                                                <i className="fas fa-check"></i> Approve
                                                            </button>
                                                            <button className="btn-reject">
                                                                <i className="fas fa-times"></i> Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
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