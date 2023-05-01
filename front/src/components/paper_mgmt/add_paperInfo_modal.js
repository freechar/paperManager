import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Radio, Button, Select } from 'antd';
import { UseAuth } from '../auth';
import axios from 'axios';
import config from '../../config/config.json'
const AddPaperInfoModal = (props) => {
    const visible = props.visible;
    const setVisible = props.setVisible;
    const [authorsInfo, setAuthorsInfo] = useState([{ UserName: '', UserId: '', Email: '' }]);
    const [teachersInfo, setTeachersInfo] = useState([{ UserName: '', UserId: '', Email: '' }]);
    const [stages, setStages] = useState([{ StageId: '', StageNames: '', stepsLength: '' }]);
    const { token } = UseAuth();
    const StepsOptions = [];
    const [form] = Form.useForm();
    const handleSubmit = (values) => {
        let formData = form.getFieldsValue(["Name", "Introduction", "Author", "Checker", "EvaluateTeachers", "Stage"]);
        let postData = new FormData();
        postData.append('thesis_title', formData.Name);
        postData.append('introduction', formData.Introduction);
        postData.append('authorid', formData.Author);
        postData.append('checker_teacher', formData.Checker);
        postData.append('evaluate_teachers', formData.EvaluateTeachers);
        postData.append('stages', formData.Stage);
        axios.post(config.apiUrl + '/auth/thesis/add', postData, {
            headers: {
                "Authorization": token
            }
        })
            .then(
                response => {
                    if (response.data.status === 'success') {
                        Modal.success({
                            title: '添加成功',
                            content: '论文添加成功',
                            onOk: () => {
                                setVisible(false);
                                props.updatehandle();
                            }
                        })
                    } else {
                        Modal.error({
                            title: '添加失败',
                            content: response.data.msg,
                        })
                    }
                })
            .catch(
                error => {
                    console.error(error);
                })
        setVisible(false);
    }
    useEffect(() => {
        axios.get(config.apiUrl + '/auth/userinfobyrole/1', {
            headers: {
                "Authorization": token
            }
        })
            .then(
                response => {
                    let teachers = []
                    if (response.data.status === 'success') {
                        for (let index in response.data.user_info) {
                            let user = response.data.user_info[index];
                            teachers.push({
                                UserName: user.UserName,
                                UserId: user.ID,
                                Email: user.Mail
                            });
                        }
                        setTeachersInfo(teachers);
                    }
                })
            .catch(
                error => {
                    console.error(error);
                })
        // 获取作者信息
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
        // 获取论文阶段信息
        axios.get(config.apiUrl + '/auth/getallstages', {
            headers: {
                "Authorization": token
            }
        })
            .then(
                response => {
                    let stages = []
                    if (response.data.status === 'success') {
                        for (let index in response.data.stages) {
                            let stage = response.data.stages[index];
                            stages.push({
                                StageId: stage.ID,
                                StageNames: stage.StageNames,
                                stepsLength: stage.Length
                            });
                        }
                        setStages(stages);
                    }
                }
            )
            .catch(
                error => {
                    console.error(error);
                })
    }, [token]);
    return (
        <Modal
            open={visible}
            title="添加论文"
            onCancel={() => setVisible(false)}
            onOk={() => {
                handleSubmit();
            }}
        >

            <Form
                name="add_paperInfo"
                form={form}
                onFinish={(values) => {
                    // console.log(values);
                    handleSubmit(values);
                }}
            >
                <Form.Item
                    label="论文名称"
                    name="Name"
                    rules={[{ required: true, message: '请输入论文名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="论文简介"
                    name="Introduction"
                    rules={[{ required: true, message: '请输入论文简介' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    label="论文作者"
                    name="Author"
                    rules={[{ required: true, message: '请输入论文作者' }]}
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
                    />
                </Form.Item>
                <Form.Item
                    label="论文指导教师"
                    name="Checker"
                    rules={[{ required: true, message: '请输入论文指导教师' }]}
                >
                    <Select
                        showSearch
                        style={{ width: 160 }}
                        placeholder="请选择指导教师"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={teachersInfo.map(({ UserName, UserId, Email }) => ({ value: UserId, label: UserName + '(' + Email + ')' }))}
                    />
                </Form.Item>
                <Form.Item
                    label="论文审阅教师"
                    name="EvaluateTeachers"
                    rules={[{ required: true, message: '请输入论文审阅教师' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="请选择审阅教师"
                        style={{ width: 160 }}
                        options={teachersInfo.map(({ UserName, UserId, Email }) => ({ value: UserId, label: UserName + '(' + Email + ')' }))}
                    />
                </Form.Item>
                <Form.Item
                    label="论文进程"
                    name="Stage"
                    rules={[{ required: true, message: '请输入论文进程' }]}
                >
                    <Select
                        showSearch
                        style={{ width: 160 }}
                        placeholder="请选择论文进程"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={stages.map(({ StageId, StageNames }) => ({ value: StageId, label: StageNames }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
AddPaperInfoModal.defaultProps = {
    updatehandle: () => { },
}

export default AddPaperInfoModal;