import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input } from 'antd';
import { useNavigate} from 'react-router-dom';

import axios from 'axios';
import { UseAuth } from '../auth';
import config from '../../config/config.json'





const DetailsModal = ({ visible, onCancel, record }) => (
    <Modal open={visible} onCancel={onCancel} footer={null}>
        <h3>{record.title}</h3>
        <p>评阅意见：{record.comment}</p>
        <p>老师姓名：{record.teacher}</p>
        <p>评阅时间：{record.time}</p>
    </Modal>
);



const CrudPage = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [commentData, setCommentData] = useState([]);
    const { token } = UseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(config.apiUrl + '/auth/comments', {
            headers: {
                "Authorization": token
            }
        })
            .then(
                response => {
                    console.log(response.data)
                    let comments = []
                    if (response.data.status === 'success') {
                        for (let index in response.data.comments) {
                            let comment = response.data.comments[index];
                            comments.push({
                                key: index.toString(),
                                CommentId: comment.CommentId,
                                title: comment.ThesisName,
                                comment: comment.CommentText,
                                teacher: comment.TeacherName,
                                time: comment.Time,
                            })
                        }
                        setCommentData(comments);
                    }
                }
            )
    },[token])

    const columns = [
        {
            title: '论文标题',
            dataIndex: 'title',
            key: 'title',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="搜索论文标题"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={confirm}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={confirm}
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
            onFilter: (value, record) => record.title.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: '评阅意见',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: '老师姓名',
            dataIndex: 'teacher',
            key: 'teacher',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="搜索老师姓名"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={confirm}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={confirm}
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
            onFilter: (value, record) => record.teacher.toLowerCase().includes(value.toLowerCase()), // 根据老师姓名筛选
        },
        {
            title: '评阅时间',
            dataIndex: 'time',
            key: 'time',
            sorter: (a, b) => new Date(a.time) - new Date(b.time), // 按时间排序
            defaultSortOrder: 'descend', // 默认按时间降序排列
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Button type="primary" onClick={() =>{navigate("/home/comment/"+commentData[record.key].CommentId)}}>
                    查看详情
                </Button>
            ),
        },
    ];

    const showModal = (record) => {
        console.log(record.key)
        setSelectedRecord(record);
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setSelectedRecord(null);
    };


    return (
        <>
            <Table
                columns={columns}
                dataSource={commentData}
                pagination={{ pageSize: 3, style: { position: 'fixed', bottom: "2%", right: "5%" } }}
                scroll={{ y: 500 }}
            />
            {selectedRecord && (
                <DetailsModal visible={modalVisible} onCancel={handleCancel} record={selectedRecord} />
            )}
        </>
    );
};

export default CrudPage;