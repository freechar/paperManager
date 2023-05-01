import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space } from 'antd';
import axios from 'axios';
import {
    SearchOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import config from '../../config/config.json'
import { UseAuth } from '../auth';
import AddEvaModal from './addEvaModal';


const EvaPaperList = () => {
    const [paperList, setPaperList] = useState([{
        "key": "",
        "id": "",
        "authorName": "",
        "title": "",
        "thesisId": "",
        "laestFile": "",
    }]);
    const { token } = UseAuth();
    const navigate = useNavigate();
    const [addEvaluateVisible, setAddEvaluateVisible] = useState(false);
    const [modalInfo, setModalInfo] = useState({
        "thesisId": "",
    });

    useEffect(() => {
        axios.get(config.apiUrl + '/auth/getthesisinfobyevateacher', {
            headers: {
                "Authorization": token
            }
        })
            .then(res => {
                if (res.data.status === "success") {
                    let thesisList = [];
                    for(let i = 0; i < res.data.thesises.length; i++) {
                        let thesis = {};
                        thesis.key = i;
                        thesis.id = res.data.thesises[i].ID;
                        thesis.authorName = res.data.thesises[i].AuthorUserInfo.UserName;
                        thesis.title = res.data.thesises[i].Name;
                        thesis.thesisId = res.data.thesises[i].ID;
                        thesis.laestFile = res.data.thesises[i].ThesisFiles.length !== 0 ?
                            res.data.thesises[i].ThesisFiles[res.data.thesises[i].ThesisFiles.length - 1].ID
                            : -1;
                        thesisList.push(thesis);
                    }
                    setPaperList(thesisList);
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
            title: '作者',
            dataIndex: 'authorName',
            key: 'authorName',
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
                    <Button type='primary' onClick={() => {setAddEvaluateVisible(true); setModalInfo({thesisId: record.thesisId})}}>
                        添加评阅意见
                    </Button>
                </Space>
            ),
        }
    ];
    return (
        <div>
            <Table columns={columns} dataSource={paperList} />
            <AddEvaModal
                visible={addEvaluateVisible}
                setVisible={setAddEvaluateVisible}
                thesisId={modalInfo.thesisId}
            />
        </div>
    )
}
export default EvaPaperList;