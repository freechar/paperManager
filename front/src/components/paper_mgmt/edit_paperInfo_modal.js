import React, { useEffect, useState, message } from 'react';
import { Modal, Form, Select } from 'antd';
import config from '../../config/config.json'
import { UseAuth } from '../auth';
import axios from 'axios';
const EditPaperInfoModal = (props) => {
    const visible = props.visible;
    const setVisible = props.setVisible;
    const paperInfo = props.paperInfo;
    const { token } = UseAuth();
    const [form] = Form.useForm();
    const [teachersInfo, setTeachersInfo] = useState([{
        UserName: '',
        UserId: '',
        Email: ''
    }]);
    const handleOk = () => {
        // console.log(form.getFieldsValue(["CheckerTeacher", "EvaluateTeachers"]));
        let formDate = form.getFieldsValue(["CheckerTeacher", "EvaluateTeachers"]);
        let postData = new FormData();
        postData.append('thesis_id', paperInfo.PaperId);
        postData.append('checker_teacher', formDate.CheckerTeacher);
        postData.append('evaluate_teachers', formDate.EvaluateTeachers);
        axios.post(config.apiUrl + '/auth/thesis/updateteacher', postData, {
            headers: {
                "Authorization": token
            }
        })
            .then(response => {
                    if (response.data.status === 'success') {
                        Modal.success({
                            title: '修改成功',
                        });
                        props.updatehandle();
                    } else {
                        Modal.error({
                            title: '修改失败',
                            content: response.data.msg,
                        });
                    }
                })
            .catch(
                error => {
                    console.error(error);
                })
        props.setVisible(false);
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
                                Email: user.Mail,
                            })
                        }
                        setTeachersInfo(teachers);
                    } else {
                        message.error(response.data.msg);
                    }
                }
            )
            .catch(
                error => {
                    console.error(error);
                }
            )
    }, [token])
    return (
        <Modal
            open={visible}
            title="修改论文分配教师信息"
            onCancel={() => setVisible(false)}
            onOk={handleOk}
        >
            {/* 修改论文信息
                这里只分配论文的指导老师和审阅老师
            */}
            <Form
                form={form}
            >
                <Form.Item name={"CheckerTeacher"}>
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
                <Form.Item name={"EvaluateTeachers"}>
                    <Select
                        mode="multiple"
                        placeholder="请选择审阅教师"
                        defaultValue={[]}
                        style={{
                            width: '100%',
                        }}
                        options={teachersInfo.map(({ UserName, UserId, Email }) => ({ value: UserId, label: UserName + '(' + Email + ')' }))}
                    />
                </Form.Item>
            </Form>

        </Modal>
    )
}

export default EditPaperInfoModal;