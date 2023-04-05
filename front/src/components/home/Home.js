import "./Home.css"
import logo from "../../assets/logo.png"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { Button, Layout, Menu, message, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { UseAuth } from '../auth';
import axios from "axios";
import config from '../../config/config.json'


const { Header, Sider, Content } = Layout;
const HomeLayout = () => {
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
  const { token } = UseAuth();
  const [menus, Setmenus] = useState([{
    key:"",
    icon:"",
    menu_name:"",
    menu_url:"",
  }]);
  useEffect(() => {
    // axios获取menus
    axios.get(config.apiUrl + '/auth/menus', {
      headers: {
        "Authorization": token
      }
    })
      .then(response => {
        if (response.data.status === "success") {
          let menus = []
          // 遍历menus
          for (let index in response.data.menus) {
            menus.push({
              key: index.toString(),
              icon: response.data.menus[index].Icon,
              menu_name: response.data.menus[index].MenuName,
              menu_url: response.data.menus[index].MenuPath,

            })
            Setmenus(menus)
          }
        } else {
          message.error(response.data.msg)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }, [token])
  // 这里写个map将icon和type对应起来
  const iconMap = {
    'user': <UserOutlined />,
    'mail': <MailOutlined />,
    'upload': <UploadOutlined />,
  }

  // 构建menu用的items
  const items = menus.map(menu => {
    return {
      key: menu.key,
      icon: iconMap[menu.icon],
      label: menu.menu_name,
      onClick: () => { navigate(menu.menu_url) },
    }
  })
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
          defaultSelectedKeys={['0']}
          items={items}
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
          <Outlet />.
        </Content>
      </Layout>
    </Layout>
  );
};
export default HomeLayout;

