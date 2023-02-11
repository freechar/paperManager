import React from 'react';
import { Form, Input, Button, Checkbox, Typography, Row, Col, Space, message, Avatar } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import logo from "../../assets/logo.png"
import axios from 'axios';
import { UseAuth} from '../auth';
const { Title } = Typography;


const LoginForm = () => {
  const{ onLogin }=UseAuth()
  const handleSubmit = async (values) => {
    // e.preventDefault();
    const data = {
      email: values.email,
      password: values.password
    };

    try {
      const response = await axios.post('http://127.0.0.1:8080/login', data);
      if (response.data.status === 'success') {
        // perform success action
        message.success('登录成功！');
        console.log(response.data.token)
        // 这里去设置下token
        
        // setToken
        onLogin(response.data.token);
      } else {
        // perform failure action
        message.error("登陆失败");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onFinish = (values) => {
    console.log('login:', values);
    handleSubmit(values);
  };
  return (
    <Row justify="center" align="middle">
      <Col>
        <Space style={{ textAlign: 'center' }}>
          <Avatar size={64} src={logo} />
          <Title level={3}>Welcome</Title>
        </Space>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: '请输入邮箱！' }]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <a className="login-form-forgot" href="/forgetpasswd">
              忘记密码
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default LoginForm;
