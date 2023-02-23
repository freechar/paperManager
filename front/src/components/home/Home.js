import "./Home.css"
import logo from "../../assets/logo.png"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  
} from '@ant-design/icons';
import { useNavigate,Outlet} from 'react-router-dom';
import { Button, Layout, Menu, theme } from 'antd';
import React, { useState } from 'react';
import { UseAuth } from '../auth';

const { Header, Sider, Content } = Layout;
const HomeLayout = () => {
  console.log("这里是Home")
  const [collapsed, setCollapsed] = useState(false);
  const { onLogout } = UseAuth()
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const onCollapse = (collapsed, type) => {
    console.log(collapsed)
    collapsed.log(type)
    return
  }    
  const navigate = useNavigate();

  const logout = (event) => {
    onLogout();
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={onCollapse} >
        {!collapsed && (
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
        )}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: '我的论文',
              onClick: ()=>{navigate("/home/student/mypapers")},
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: '待处理意见',
              onClick: ()=>{navigate("/home")},

            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}

          <h1 style={{ fontSize: '36px', color: '#333' }}>PaperManager 论文版本管理系统</h1>

          <Button type="primary" size='middle' style={{ top: 10, marginLeft: 'auto', right: 30 }} onClick={logout}>
            登出
          </Button>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet/>.
        </Content>
      </Layout>
    </Layout>
  );
};
export default HomeLayout;

