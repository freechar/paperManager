import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import {
    SearchOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { UseAuth } from '../auth';
import config from '../../config/config.json'
import UserInfoAddModal from './add_user_modal';
import UserInfoUpdateModal from './update_user_modal';


const UserList = () => {

    const { token } = UseAuth();
    const [userList, setUserList] = useState([
        {
            "key": "",
            "UserId": "",
            "UserName": "",
            "UserType": "",
            "Email": ""
        },
    ]);
    const UserTypeMap = {
        "0": "学生",
        "1": "教师",
        "2": "管理员"
    }
    const [addUserModalVisible, setAddUserModalVisible] = useState(false);
    const [updateUserModalVisible, setUpdateUserModalVisible] = useState(false);
    const [updateRecord, setUpdateRecord] = useState({
        userInfo: {}
    });
    
    const updateUserList = () => {
        axios.get(config.apiUrl + '/auth/getalluserinfo', {
            headers: {
                "Authorization": token
            }
        })
            .then(
                response => {
                    let userList = []
                    if (response.data.status === 'success') {
                        for (let index in response.data.user_info) {
                            let user = response.data.user_info[index];
                            userList.push({
                                key: index.toString(),
                                UserId: user.ID,
                                UserName: user.UserName,
                                UserType: UserTypeMap[user.UserType],
                                Email: user.Mail,
                            })
                        }
                        setUserList(userList);
                    }
                }
            )
    }

    useEffect(() => {
        updateUserList();
    }, [token])
    const columns = [
        {
            title: '用户ID',
            dataIndex: 'UserId',
            key: 'UserId',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="搜索用户ID"
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
            onFilter: (value, record) => record.UserId.toString().toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: '用户名',
            dataIndex: 'UserName',
            key: 'UserName',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="搜索用户名"
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
            onFilter: (value, record) => record.UserName.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: '用户类型',
            dataIndex: 'UserType',
            key: 'UserType',
            filters: [
                {
                    text: '学生',
                    value: "学生",
                },
                {
                    text: '教师',
                    value: "教师",
                },
                {
                    text: '管理员',
                    value: "管理员",
                },
            ],
            onFilter: (value, record) => record.UserType === (value),
        },
        {
            title: '邮箱',
            dataIndex: 'Email',
            key: 'Email',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="搜索邮箱"
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
            onFilter: (value, record) => record.Email.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type='primary' onClick={() => {
                        setUpdateUserModalVisible(true)
                        setUpdateRecord(record);
                    }}>
                        编辑
                    </Button>
                    <Button type="primary" onClick={() => {
                        axios.delete(config.apiUrl + '/auth/user/delete/' + record.UserId, {
                            headers: {
                                "Authorization": token
                            },
                        })
                            .then(
                                response => {
                                    if (response.data.status === 'success') {
                                        message.success('删除成功');
                                        let newUserList = userList.filter((user) => {
                                            return user.UserId !== record.UserId;
                                        })
                                        setUserList(newUserList);
                                    }
                                    else {
                                        message.error('删除失败');
                                    }
                                }
                            )
                    }} >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];
    return (
        <>
            <Table columns={columns} dataSource={userList} />
            <Button type="primary" onClick={() => {
                setAddUserModalVisible(true);
            }}>添加用户</Button>
            <UserInfoAddModal
                visible={addUserModalVisible}
                setVisible={setAddUserModalVisible}
                updatehandle={updateUserList}
            />
            <UserInfoUpdateModal
                visible={updateUserModalVisible}
                setVisible={setUpdateUserModalVisible}
                updatehandle={updateUserList}
                userInfo={updateRecord}
            />
        </>


    )
}

export default UserList;