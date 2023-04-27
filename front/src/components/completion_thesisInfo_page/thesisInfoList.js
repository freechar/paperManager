// config
import config from '../../config/config.json'
import axios from "axios";
import { UseAuth } from '../auth';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
    SearchOutlined
} from '@ant-design/icons';
import { Button, Input, message, Space, Table } from 'antd';
import StudentUpdateModal from './UpdateStudentModal';
import ThesisInfoUpdateModal from '../thesis_info/ThesisInfoUpdateModal';

const CltThesisInfoList = () => {
    const { token } = UseAuth();
    const navigate = useNavigate();
    const [thesisList, setThesisList] = useState([{ "key": "", "id": "", "title": "", "AutorName": "" }]);
    const [updateAuthorVisible, setUpdateAuthorVisible] = useState(false);
    const [editThesisInfoVisible, setEditThesisInfoVisible] = useState(false);
    const [modalInfo, setModalInfo] = useState({});

    const updatehandle = () => {
        axios.get(config.apiUrl + '/auth/thesis/needtocompletion', {
            headers: {
                "Authorization": token
            }
        })
            .then(res => {
                if (res.data.status === "success") {
                    let thesisList = [];
                    // console.log(res.data.thesis_infos)
                    for (let i = 0; i < res.data.thesis_infos.length; i++) {
                        let thesis = {};
                        thesis.key = i;
                        thesis.id = res.data.thesis_infos[i].ID;
                        thesis.title = res.data.thesis_infos[i].Name;
                        thesis.AutorName = res.data.thesis_infos[i].AuthorUserInfo.UserName;
                        thesisList.push(thesis);
                    }
                    setThesisList(thesisList);
                }
            })
    }


    useEffect(() => {
        updatehandle();
    }, [token])
    const columns = [
        // ID
        {
            tilte: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        // 论文题目
        {
            title: '论文题目',
            dataIndex: 'title',
            key: 'title',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder={`Search title`}
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
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => record.title.toLowerCase().includes(value.toLowerCase()),
        },
        // 目前分配学生 
        {
            title: '目前分配学生',
            dataIndex: 'AutorName',
            key: 'AutorName',
        },
        // 操作
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Button type="primary" onClick={() => { setEditThesisInfoVisible(true); setModalInfo(record) }}>编辑论文信息</Button>
                    <Button type="primary" onClick={() => { setUpdateAuthorVisible(true); setModalInfo(record) }} >分配学生</Button>
                    <Button type="primary" onClick={() => {
                        navigate('/home/thesisinfo/' + record.id);
                    }}>转到论文详情页</Button>
                    <Button type='primary' onClick={()=>{
                        let postData = new FormData();
                        postData.append("thesis_id", record.id);
                        axios.post(config.apiUrl + '/auth/thesis/completion', postData, {
                            headers: {
                                "Authorization": token
                            }
                        })
                            .then(res => {
                                if (res.data.status === "success") {
                                    message.success("成功")
                                    updatehandle();
                                }
                            })
                    }}>已完善信息</Button>
                </Space>

            )
        }
    ]
    return (
        <>
            <Table columns={columns} dataSource={thesisList} />
            <StudentUpdateModal visible={updateAuthorVisible}
                setVisible={setUpdateAuthorVisible}
                modalInfo={modalInfo}
                updatehandle={updatehandle}
            />
            <ThesisInfoUpdateModal
                visible={editThesisInfoVisible}
                setVisible={setEditThesisInfoVisible}
                ThesisId={modalInfo.id}
                updatehandle={updatehandle}
            />
        </>
    )
}


export default CltThesisInfoList;