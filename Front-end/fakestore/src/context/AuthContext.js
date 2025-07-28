// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Verificar localStorage ao carregar
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                // Verificar se token é válido (básico)
                const payload = JSON.parse(atob(token.split('.')[1]));
                const isExpired = payload.exp * 1000 < Date.now();
                
                if (isExpired) {
                    // Token expirado - fazer logout
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                } else {
                    // Token válido
                    setIsAuthenticated(true);
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    if (userData) {
                        setUser(userData);
                    }
                }
            } catch (error) {
                // Token inválido
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
            }
        }
        
        setLoading(false);
    }, []); 

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userData', JSON.stringify(userData));
    };
    
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
    };
    
    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
};
