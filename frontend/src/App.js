import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewCarApplication from './components/NewCarApplication';
import TradeInApplication from './components/TradeInApplication';
import ApplicationReview from './components/ApplicationReview'; 
import { AuthProvider, useAuth } from './context/AuthContext';
import UserManagement from './components/UserManagement';
import ApplicationDetails from './components/ApplicationDetails';
import './App.css';


function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
                        <Route path="/new-car" element={<ProtectedRoute> <NewCarApplication /> </ProtectedRoute>} />
                        <Route path="/trade-in" element={<ProtectedRoute> <TradeInApplication /> </ProtectedRoute>} />
                        <Route path="/review/:id" element={<ProtectedRoute> <ApplicationReview /> </ProtectedRoute>} />
                        <Route path="/users" element={<ProtectedRoute> <UserManagement /> </ProtectedRoute>} />
                        <Route path="/application/:id" element={<ApplicationDetails />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
    
}

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="loading">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

export default App;


