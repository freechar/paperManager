import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, message } from 'antd';
import axios from 'axios';
import {
    SearchOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import config from '../../config/config.json'
import { UseAuth } from '../auth';
const MyStuList = () => {
    const [stuList, setStuList] = useState([{
        "key": "",
        "id": "",
        "name": "",
        "title": "",
        "thesisId": "",
        "laestFile": "",
    }]);
    const { token } = UseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(config.apiUrl + '/auth/getthesisinfobychecker', {
            headers: {
                "Authorization": token
            }
        })
            .then(res => {
                if (res.data.status === "success") {
                    let thesisList = [];
                    for (let i = 0; i < res.data.data.length; i++) {
                        let userId = res.data.data[i].StudentId;
                        let userName = res.data.data[i].StudentName;
                        for (let j = 0; j < res.data.data[i].Thesises.length; j++) {
                            if (res.data.data[i].Thesises[j].Status === 0) continue;
                            let thesis = {};
                            thesis.key = i * 100 + j;
                            thesis.id = userId;
                            thesis.name = userName;
                            thesis.title = res.data.data[i].Thesises[j].Name;
                            thesis.thesisId = res.data.data[i].Thesises[j].ID;
                            thesis.laestFile = res.data.data[i].Thesises[j].ThesisFiles.length !== 0 ?
                                res.data.data[i].Thesises[j].ThesisFiles[res.data.data[i].Thesises[j].ThesisFiles.length - 1].ID
                                : -1
                                ;
                            thesisList.push(thesis);
                        }
                    }
                    console.log(thesisList)
                    setStuList(thesisList);
                }
            })
    }, [token])
    const columns = [
        // ID
        {
            tilte: 'ID',
            dataIndex: 'id',
            key: 'id',

        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="搜索论文名称"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={confirm}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={confirm}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            搜索
                        </Button>
                        <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
                            重置
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) =>
                record.PaperName.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: '论文题目',
            dataIndex: 'title',
            key: 'title',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="搜索论文名称"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={confirm}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={confirm}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            搜索
                        </Button>
                        <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
                            重置
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) =>
                record.PaperName.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type='primary' onClick={() => {
                        navigate('/home/thesisinfo/' + record.thesisId);
                    }}>
                        转到论文详情页面
                    </Button>
                    <Button type='primary' onClick={() => {
                        navigate('/home/paper/' + record.laestFile);
                    }}>
                        指导论文
                    </Button>
                    <Button type='primary' onClick={() => {
                        let postData = new FormData();
                        postData.append("thesis_id", record.thesisId);
                        axios.post(config.apiUrl + '/auth/stage/next', postData, {
                            headers: {
                                "Authorization": token
                            }
                        })
                            .then(res => {
                                if (res.data.status === "success") {
                                    message.success("进入下个阶段成功");
                                }
                                else {
                                    message.error("进入下个阶段失败");
                                }
                            }
                            )
                            .catch(err => {
                                console.log(err);
                            }
                            )
                    }}>
                        进入下个阶段
                    </Button>
                </Space>
            ),
        }
    ];
    return (
        <div>
            <Table columns={columns} dataSource={stuList} />
        </div>
    )
}
export default MyStuList;