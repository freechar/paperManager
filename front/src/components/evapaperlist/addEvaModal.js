import React, { useEffect, useState } from 'react';
import { Table, Input, Modal, message ,Form} from 'antd';
import axios from 'axios';
import {
    SearchOutlined
} from '@ant-design/icons';

import config from '../../config/config.json'
import { UseAuth } from '../auth';


const AddEvaModal = (props) => {
    const visible = props.visible;
    const setVisible = props.setVisible;
    const { token } = UseAuth();
    const [form] = Form.useForm();
    return (
        <Modal
            title="添加评阅意见"
            open={visible}
            onClose={() => setVisible(false)}
            onOk={() => {
                let formData = form.getFieldsValue(["evaluation"]);
                let postData = new FormData();
                postData.append('thesis_file_id', props.thesisId);
                postData.append('evaluate_text', formData.evaluation);
                axios.post(config.apiUrl + '/auth/addevaluate', postData, {
                    headers: {
                        "Authorization": token
                    }
                })
                    .then(
                        response => {
                            if (response.data.status === 'success') {
                                message.success('添加评阅意见成功');
                                setVisible(false);
                            }
                        }
                    )
                    .catch(
                        error => {
                            console.error(error);
                        }
                    )
            }}
        >
            <Form
                form={form}
            >
                <Form.Item
                    label="评阅意见"
                    name="evaluation"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    )
}


export default AddEvaModal;