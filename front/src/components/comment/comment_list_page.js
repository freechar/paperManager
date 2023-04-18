import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { UseAuth } from '../auth';
import config from '../../config/config.json'

const CrudPage = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [commentData, setCommentData] = useState([{
        ThesisFileId: "",
        key: "",
    }]);
    const { token } = UseAuth();
    const navigate = useNavigate();
    const updateCommentData = () => {
        axios.get(config.apiUrl + '/auth/comments', {
            headers: {
                "Authorization": token
            }
        })
            .then(
                response => {
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
                                ThesisFileId: comment.ThesisFileId,
                            })
                        }
                        setCommentData(comments);
                    }
                }
            )
    }
    useEffect(() => {
        updateCommentData()
    }, [token])

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
            title: '提出者',
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
                <>
                    <Button type="primary" onClick={() => { navigate("/home/comment/" + commentData[record.key].CommentId) }}>
                        查看详情
                    </Button>
                    <Button type='primary' onClick={() => {
                        navigate("/home/paper/" + commentData[record.key].ThesisFileId)
                    }}
                        style={{ marginLeft: '5px' }}
                    >
                        转到论文
                    </Button>
                    {/* 如果user_type == 1则显示一个删除评论按钮 */}
                    {props.user_type == 1 &&
                        <Button type='primary' style={{ marginLeft: '5px' }} onClick={() => {
                            axios.delete(config.apiUrl + '/auth/comment/delete/' + commentData[record.key].CommentId, {
                                headers: {
                                    "Authorization": token
                                }
                            })
                                .then(
                                    response => {
                                        if (response.data.status === 'success') {
                                            Modal.success({
                                                content: '删除成功',
                                            });
                                            // react 重新渲染
                                            updateCommentData();
                                        }
                                        else {
                                            Modal.error({
                                                content: '删除失败',
                                            });
                                        }
                                    }
                                )
                        }} >删除评论</Button>
                    }
                </>

            ),
        },
    ];


    return (
        <>
            <Table
                columns={columns}
                dataSource={commentData}
                pagination={{ pageSize: 8, style: { position: 'fixed', bottom: "2%", right: "5%" } }}
                scroll={{ y: 'calc(100vh - 100px)' }}
            />
        </>
    );
};

export default CrudPage;