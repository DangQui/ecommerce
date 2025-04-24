import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập từ localStorage khi tải trang
        const storedAuth = localStorage.getItem('isAuthenticated');
        const storedEmail = localStorage.getItem('userEmail');
        if (storedAuth === 'true' && storedEmail) {
            setIsAuthenticated(true);
            setUserEmail(storedEmail);
        }
    }, []);

    const login = (email) => {
        setIsAuthenticated(true);
        setUserEmail(email);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserEmail(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);