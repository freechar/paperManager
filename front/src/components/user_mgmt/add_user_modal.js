import React, { useState } from 'react';
import { Modal, Form, Input, Radio, Button } from 'antd';
import config from '../../config/config.json'
import axios from 'axios';



const UserInfoAddModal = (props) => {
    
    const onCancel = () => {
        props.setVisible(false);
    }
    const handleOk = () => {
    }
    const [UserType, setUserType] = useState(0); // 0是学生 1是老师 2是管理员
    const [form] = Form.useForm();
    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    }
    const handleSubmit =async (values) => {
        let formData = new FormData();
        formData.append('mail', values.email);
        formData.append('password', values.password);
        formData.append('user_name', values.username);
        formData.append('user_type', UserType);
        try {
            const response = await axios.post(config.apiUrl + "/register", formData);
            if (response.data.status === 'success') {
                Modal.success({
                    title: '添加成功',
                });
                // 这里去更新下用户列表
                props.updatehandle();
            } else {
                Modal.error({
                    title: '添加失败',
                    content: response.data.msg,
                });
            }
        } catch (error) {
            console.error(error);
        }
        props.setVisible(false);
    }
    return (<Modal
        open={props.visible}
        title="添加用户"
        onCancel={onCancel}
        onOk={handleOk}
    >
        <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {

                handleSubmit(values);
            }}
        >
            <Form.Item label="用户名" name="username" rules={[{ required: true, message: '用户名' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="密码" name="password" rules={[{ required: true, message: '用户密码' }, { min: 6, max: 15, message: "请输入最小6位, 最长15位的密码" }]}>
                <Input.Password />
            </Form.Item>
            {/* // 验证邮箱输入符合规则 */}
            <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '用户邮箱', }, { type: 'email', message: "格式不正确" }]}>
                <Input />
            </Form.Item>
            {/* 添加多选 用户类别 */}
            <Form.Item>
                <Radio.Group value={UserType} onChange={handleUserTypeChange}>
                    <Radio.Button value={0}>student</Radio.Button>
                    <Radio.Button value={1}>teacher</Radio.Button>
                    <Radio.Button value={2}>admin</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    添加
                </Button>
            </Form.Item>
        </Form>
    </Modal>
    )
}

UserInfoAddModal.defaultProps = {
    updatehandle: () => { },
}

export default UserInfoAddModal;