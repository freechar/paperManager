import React from 'react';
import { Navigate } from 'react-router-dom';

let AuthContext = React.createContext(null)

const Auth = ({ children }) => {
    
    const [token, setToken] = React.useState(null);

    const handleLogin = (jwt_token) => {
        setToken(jwt_token);
        // 存入localStorage
        window.localStorage.setItem('token', jwt_token);
    };

    const handleLogout = () => {
        setToken(null);
    };

    const value = {
        token: window.localStorage.getItem('token') || token,
        onLogin: handleLogin,
        onLogout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
const UseAuth = () => {
    return React.useContext(AuthContext);
};
const ProtectedRoute = ({ children }) => {

    const { token } = UseAuth();
    console.log(token);
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
export { Auth, ProtectedRoute, UseAuth, AuthContext };
