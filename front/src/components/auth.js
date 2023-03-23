import React from 'react';
import { Navigate } from 'react-router-dom';

let AuthContext = React.createContext("")

const Auth = ({ children }) => {
    
    const [token, setToken] = React.useState(null);
    const handleLogin = (jwt_token) => {
        window.localStorage.setItem('token', jwt_token);
        setToken(jwt_token);
        // 存入localStorage
        
    };

    const handleLogout = () => {
        console.log("Logout")
        window.localStorage.setItem('token',""); 
        setToken("");
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
    if (!token||token==="") {
        console.log("没登陆 滚去login")
        return <Navigate to="/login" replace />;
    }

    return children;
};
export { Auth, ProtectedRoute, UseAuth, AuthContext };
