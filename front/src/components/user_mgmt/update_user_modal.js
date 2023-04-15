import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import config from '../../config/config.json'
import { UseAuth } from '../auth';
import axios from 'axios';

const UserInfoUpdateModal = (props) => {
    const { token } = UseAuth();
    const UserName = props.userInfo.UserName;
    const UserId = props.userInfo.UserId;
    const onCancel = () => {
        props.setVisible(false);
    }
    const handleOk = () => {
        console.log(props.userInfo)
        // props.setVisible(false);
    }
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            username: UserName
        })
    }, [UserName])

    const handleSubmit = async (value) => {
        let formData = new FormData();
        formData.append('user_id', UserId);
        formData.append('user_name', value.username);
        formData.append('password', value.password);

        try {
            const response = await axios.post(config.apiUrl + '/auth/user/update', formData, {
                headers: {
                    "Authorization": token
                }
            })
            if (response.data.status === 'success') {
                Modal.success({
                    title: '修改成功',
                });
                // 这里去更新下用户列表
                props.updatehandle();
            } else {
                Modal.error({
                    title: '修改失败',
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
        title="修改用户信息"
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
            <Form.Item label="密码(不填入不会被修改)" initialValue={""} name="password" rules={[{ required: false, message: '用户密码' }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    保存
                </Button>
            </Form.Item>
        </Form>
    </Modal>
    )
}
UserInfoUpdateModal.defaultProps = {
    updatehandle: () => { },
}


export default UserInfoUpdateModal;