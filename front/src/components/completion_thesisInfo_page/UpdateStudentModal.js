import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import config from '../../config/config.json'
import { UseAuth } from '../auth';
import axios from 'axios';
import { useForm } from 'rc-field-form';


const StudentUpdateModal = (props) => {
    const visible = props.visible;
    const setVisible = props.setVisible;
    const { token } = UseAuth();
    const [authorsInfo, setAuthorsInfo] = useState([{ UserName: '', UserId: '', Email: '' }]);
    const [form] = Form.useForm();
    const thesisId = props.modalInfo.id;
    useEffect(() => {
        axios.get(config.apiUrl + '/auth/userinfobyrole/0', {
            headers: {
                "Authorization": token
            }
        })
            .then(
                response => {
                    let authors = []
                    if (response.data.status === 'success') {
                        // console.log(response.data)
                        for (let index in response.data.user_info) {
                            let user = response.data.user_info[index];
                            authors.push({
                                UserName: user.UserName,
                                UserId: user.ID,
                                Email: user.Mail
                            });
                        }
                        setAuthorsInfo(authors);
                    }
                })
            .catch(
                error => {
                    console.error(error);
                })
    },[token])

    const handleSubmit = () => {
        let formData = form.getFieldsValue(["Author"])
        console.log(formData)
        let postData = new FormData();
        postData.append('thesis_id', thesisId);
        postData.append('author_id', formData.Author)
        axios.post(config.apiUrl + '/auth/thesis/updateauthor', postData, {
            headers: {
                "Authorization": token
            }
        })
            .then(
                response => {
                    if (response.data.status === 'success') {
                        props.updatehandle();
                        setVisible(false);
                    }
                }
            )
            .catch(
                error => {
                    console.error(error);
                }
            )
    }
    return (
        <Modal
            onCancel={() => { setVisible(false) }}
            onOk={() => { handleSubmit() }}
            open={visible}
        >
            <Form
                name="updateThesisAuthor"
                form={form}
            >
                <Form.Item
                    label="论文作者"
                    name="Author"
                >
                    <Select
                        showSearch
                        style={{ width: 160 }}
                        placeholder="请选择作者"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={authorsInfo.map(({ UserName, UserId, Email }) => ({ value: UserId, label: UserName + '(' + Email + ')' }))}
                    >
                    </Select>
                </Form.Item>
            </Form>
        </Modal>

    )
}

StudentUpdateModal.defaultProps = {
    updatehandle: () => { },
}
export default StudentUpdateModal;