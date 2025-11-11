import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

const UserManagement = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'sales',
        isActive: true
    });
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'manager') {
            fetchUsers();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/users');
            setUsers(response.data.data.users);
        } catch (error) {
            console.error('Error fecting users:', error);
            alert('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                
                await api.put(`/api/user/${editingUser._id}`, {
                    name: formData.name,
                    role: formData.role,
                    isActive: formData.isActive
                });
                alert('User updated successfully');
            } else {
                await api.post('/api/users', formData);
                alert('User created successfully');
            }

            setShowForm(false);
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'sales', isActive: true });
            fetchUsers();

        } catch (error) {
            const message = error.response?.data?.message || 'Failed to save user';
            alert(message);
        }
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditUser = (userData) => {
        setEditingUser(userData);
        setFormData({
            name: userData.name,
            email: userData.email,
            password: '',
            role: userData.role,
            isActive: userData.isActive
        });
        setShowForm(true);
    };

   

    const handleCreateNew = () => {
        

        setEditingUser(null);

       
        setTimeout(() => {
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'sales',
                isActive: true
            });
            setShowForm(true);
        }, 50);
    };



    const toggleUserStatus = async (userId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${ currentStatus? 'deactivate': 'activate' } this user ?`)) {
            return;
        }
        try {
            await api.put(`/api/users/${ userId }`, { isActive: !currentStatus });
            alert('User status updated successfully');
            fetchUsers();

        } catch (error) {
            alert('Failed to update user status');
        }
    };

    const deleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await api.delete(`/api/users/${userId}`);
            alert('User deleted successfully');
            fetchUsers();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete user';
            alert(message);
        }
    };

    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
        return (
            <div className="access-denied">
                <i className="fas fa-exclamation-triangle"></i>
                <h3>Access Denied</h3>
                <p>You dont have permission to access user Management.</p>
            </div>
        );
    }

    return (
        <div className="user-management">
            <div className="section-header">
                <div className="header-left">
                    <Link
                        to="/"
                        className="btn btn-outline"
                        style={{ marginRight: '16px', textDecoration: 'none' }}
                    >
                    Back
                    </Link>
                </div>
                <div className="header-title">
                    <i className="fas fa-users-cog"></i>
                    <h2>User Management</h2>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleCreateNew}
                >
                    <i className="fas fa-plus"></i> Add New User
                </button>
            </div>
            {showForm && (
                <div className="modal-overlay" key={editingUser ? `edit-${editingUser._id}` : 'create-new'}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingUser ? 'Edit User' : 'Create New User'}</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowForm(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

  
                      

                        <form onSubmit={handleSubmit} className="user-form" autoComplete="off">

                            <input type="text" style={{ display: 'none' }} autoComplete="username" />
                            <input type="password" style={{ display: 'none' }} autoComplete="current-password" />
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        required
                                        className="modern-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        required
                                        className="modern-input"
                                        disabled={editingUser}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Password {editingUser ? '(Leave blank to keep current)' : '*'}
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="modern-input"
                                        minLength="6"
                                        required={!editingUser}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Role *
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => handleInputChange('role', e.target.value)}
                                        className="modern-select"
                                    >
                                        <option value="sales">Sales </option>
                                        <option value="manager">Manager</option>
                                        {user.role === 'admin' && <option value="admin">Admin</option>}
                                    </select>
                                </div>
                                {editingUser && (
                                    <div className="form-group">
                                        <label>Status</label>
                                        <div className="status-toggle">
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) => handleInputChange('isActive', e.target.checked)}

                                            />
                                            <span className="toggle-label">
                                                {formData.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>

                                <button type="submit" className="btn btn-primary">
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            )}

            <div className="users-table-container">
                {loading ? (
                    <div className="loading-state">
                        <i className="fas fa-spinner fa-spin"></i>
                        <p>Loading Users...</p>
                    </div>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Last Login</th>
                                <th>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {users.map(userItem => (
                                <tr key={userItem._id} className={!userItem.isActive ? 'inactive' : ''}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                <i className="fas fa-user-circle"></i>

                                            </div>
                                            <div className="user-details">
                                                <div className="user-name">{userItem.name}</div>
                                                <div className="user-email">{userItem.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={`role-badge ${userItem.role}`}>
                                            <i className={`fas ${userItem.role === 'admin' ? 'fa-crown' :
                                                userItem.role === 'manager' ? 'fa-user-tie' : 'fa-user'
                                                }`}></i>
                                            {userItem.role}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`status-badge ${userItem.isActive ? 'active' : 'inactive'}`}>
                                            {userItem.isActive ? 'Active' : 'Inactive'}
                                        </span>

                                    </td>

                                    <td>
                                        <div className="last-login">
                                            {userItem.lastLogin
                                                ? new Date(userItem.lastLogin).toLocaleDateString()
                                                : 'Never'
                                            }
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-actions">
                                            <button
                                                className="btn-action edit"
                                                onClick={() => handleEditUser(userItem)}
                                                title="Edit User"
                                            >
                                            Edit
                                                <i className="fas fa-edit"></i>
                                            </button>

                                            <button
                                                className={`btn-action ${userItem.isActive ? 'deactivate' : 'activate'}`}
                                                onClick={() => toggleUserStatus(userItem._id, userItem.isActive)}
                                                title={userItem.isActive ? 'Deactivate User' : 'Activate User'}

                                            >
                                            Deactivate
                                                <i className={`fas ${userItem.isActive ? 'fa-user-slash' : 'fa-user-check'}`}> </i>
                                            </button>
                                            {user.role === 'admin' && userItem.role != 'admin' && (
                                                <button
                                                    className="btn-action delete"
                                                    onClick={() => deleteUser(userItem._id, userItem.name)}
                                                    title="Delete User"
                                                >
                                                Delete
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );

};


export default UserManagement;