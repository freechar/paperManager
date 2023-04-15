import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Radio, Button, Select, Table, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config/config.json'
import { UseAuth } from '../auth';

const EditPaperStepsModal = (props) => {
    const setVisible = props.setVisible;
    const visible = props.visible;
    const { token } = UseAuth();
    const [inputValue, setInputValue] = useState('');
    const [paperSteps, setPaperSteps] = useState([{
        "key": "",
    }]);
    useEffect(() => {
        axios.get(config.apiUrl + '/auth/getallstages', {
            headers: {
                "Authorization": token
            }
        })
            .then(
                response => {
                    if (response.data.status === "success") {
                        let stages = [];
                        for (let index in response.data.stages) {
                            let stage = response.data.stages[index];
                            stages.push({
                                key: index.toString(),
                                StageId: stage.ID,
                                StageNames: stage.StageNames,
                                stepsLength: stage.Length,
                            })

                        }
                        setPaperSteps(stages);
                    }
                })
    }, [token])
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }
    const addStepsHandler = () => {
        let postData = new FormData();
        postData.append('stages', inputValue);
        axios.post(config.apiUrl + '/auth/addstages', postData, {
            headers: {
                "Authorization": token
            }
        })
            .then(
                response => {
                    if (response.data.status === "success") {
                        Modal.success({
                            title: '添加成功',
                        });
                    } else {
                        Modal.error({
                            title: '添加失败',
                            content: response.data.msg,
                        });
                    }
                }
            )
            .catch(
                error => {
                    console.log(error);
                }
            )
        setInputValue('');
    }
    const columns = [
        {
            title: '进度详情',
            dataIndex: 'StageNames',
            key: 'StageNames',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="搜索进度详情"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={confirm}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={confirm}
                        icon="search"
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        搜索
                    </Button>
                    <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
                        重置
                    </Button>
                </div>
            ),
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => record.stepsDetail.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: '进度长度',
            dataIndex: 'stepsLength',
            key: 'stepsLength',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Button type="primary" onClick={() => {
                        axios.delete(config.apiUrl + '/auth/delstages/' + record.StageId, {
                            headers: {
                                "Authorization": token
                            },
                        })
                            .then(
                                response => {
                                    if (response.data.status === "success") {
                                        message.success('删除成功');
                                    } else {
                                        message.error('删除失败: ' + response.data.msg);
                                    }
                                })
                            .catch(
                                error => {
                                    console.log(error);
                                })
                            // 更新表格
                            let newPaperSteps = paperSteps.filter((item) => {
                                return item.key !== record.key;
                            })
                            setPaperSteps(newPaperSteps);
                    }}>
                        删除
                    </Button>
                </div>
            ),
        }
    ]
    return (
        <Modal
            open={visible}
            onCancel={() => setVisible(false)}
        >
            <Table columns={columns} dataSource={paperSteps} />
            <Input value={inputValue} onChange={handleInputChange} />
            <Button onClick={addStepsHandler}>
                添加进度
            </Button>
        </Modal>
    )
}
export default EditPaperStepsModal;