import React from 'react';
import {Card } from 'antd';
import LoginForm from './LoginForm';
import { UseAuth } from '../auth';
import { Navigate } from 'react-router-dom';
const Login = () => {
  const{ token }=UseAuth()
  if (token!==""&&token!==null) {
    return <Navigate to="/student/mypapers" replace />;
  }
  return (
    <div style={{ backgroundImage: 'url(http://www.hfut.edu.cn/images/tusan.jpg)',backgroundSize: 'cover', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: 300, padding: '20px' }}>
        <LoginForm />
      </Card>
    </div>
  );
};

export default Login;
