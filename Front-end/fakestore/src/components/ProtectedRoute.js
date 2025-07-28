// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from './toast/Toast';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            Toast.warning("⚠️ Você precisa estar logado para acessar esta página");
        }
    }, [loading, isAuthenticated]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px'
            }}>
                Carregando...
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    return children;
}

export default ProtectedRoute;
