import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    SearchOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { UseAuth } from '../auth';
import config from '../../config/config.json'
import EditPaperInfoModal from './edit_paperInfo_modal';
import EditPaperStepsModal from './paper_steps_mgmt_modal';
import AddPaperInfoModal from './add_paperInfo_modal';

const PaperMgmtList = () => {
    const { token } = UseAuth();
    const [paperList, setPaperList] = useState([
        {
            "key": "",
            "PaperId": "",
            "PaperName": "",
            "PaperAuthor": "",
            "Checkers": [],
            "EvaluateTeachers": [],
        },
    ]);

    const [editPaperInfoModalVisible, setEditPaperInfoModalVisible] = useState(false);
    const [editPaperInfoRecord, setEditPaperInfoRecord] = useState({});
    const [addPaperInfoModalVisible, setAddPaperInfoModalVisible] = useState(false);
    const [editPaperStepsModalVisible, setEditPaperStepsModalVisible] = useState(false);

    const updatelist = () => {
        axios.get(config.apiUrl + '/auth/getallthesisinfo', {
            headers: {
                "Authorization": token
            }
        })
            .then(
                response => {
                    let paperList = []
                    if (response.data.status === 'success') {
                        console.log(response.data.thesis_infos);
                        for (let index in response.data.thesis_infos) {
                            let checkers = []
                            for (let i in response.data.thesis_infos[index].Checkers) {
                                checkers.push(response.data.thesis_infos[index].Checkers[i].UserName)
                            }
                            let EvaluateTeachers = []
                            for (let i in response.data.thesis_infos[index].EvaluateTeachers) {
                                EvaluateTeachers.push(response.data.thesis_infos[index].EvaluateTeachers[i].UserName)
                            }
                            let paper = response.data.thesis_infos[index];
                            paperList.push({
                                key: index.toString(),
                                PaperId: paper.ID,
                                PaperName: paper.Name,
                                PaperAuthor: paper.AuthorUserInfo.UserName,
                                Checkers: checkers,
                                EvaluateTeachers: EvaluateTeachers,
                            })
                        }
                        setPaperList(paperList);
                    }
                }
            )
    }
    // 跳转
    const navigate = useNavigate();
    useEffect(() => {
        updatelist();
    }, [token])
    const columns = [
        // 论文Id
        {
            title: '论文ID',
            dataIndex: 'PaperId',
            key: 'PaperId',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="搜索论文ID"
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
            onFilter: (value, record) => record.PaperId.toString().toLowerCase().includes(value.toLowerCase()),
            render: text => <a>{text}</a>,
        },
        // 论文名称
        {
            title: '论文名称',
            dataIndex: 'PaperName',
            key: 'PaperName',
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
        // 论文作者
        {
            title: '论文作者',
            dataIndex: 'PaperAuthor',
            key: 'PaperAuthor',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="搜索论文作者"
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
                record.PaperAuthor.toString().toLowerCase().includes(value.toLowerCase()),
        },
        // 论文指导教师
        {
            title: '论文指导教师',
            dataIndex: 'Checkers',
            key: 'Checkers',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="搜索论文审核人"
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
                // record.Checkers是数组
                // 拼接起来搜索
                record.Checkers.join("").toLowerCase().includes(value.toLowerCase()),
        },
        // 论文评阅老师
        {
            title: '论文评阅老师',
            dataIndex: 'EvaluateTeachers',
            key: 'EvaluateTeachers',
            render: (_, { EvaluateTeachers }) => (
                <>
                    {EvaluateTeachers.map((teacher,index) => {

                        return (
                            <div key={index}>
                                {teacher}
                            </div>
                        );
                    })}
                </>
            ),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="搜索论文评阅人"
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
                // record.Checkers是数组
                // 拼接起来搜索
                record.Checkers.join("").toLowerCase().includes(value.toLowerCase()),
        },
        // 操作
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => { navigate("/home/thesisinfo/" + record.PaperId.toString()) }}>
                        查看
                    </Button>
                    <Button type="primary" onClick={() => {
                        setEditPaperInfoModalVisible(true);
                        setEditPaperInfoRecord(record);
                    }} >
                        编辑指导教师和评阅老师
                    </Button>

                    <Button type="primary" onClick={() => {
                        axios.delete(config.apiUrl + "/auth/thesis/delete/" + record.PaperId.toString(), {
                            headers: {
                                "Authorization": token
                            }
                        })
                            .then((res) => {
                                if (res.data.status === 'success') {
                                    message.success("删除成功");
                                    let newPaperList = paperList.filter((item) => {
                                        return item.PaperId !== record.PaperId;
                                    }
                                    )
                                    setPaperList(newPaperList);
                                }
                            })
                    }}>
                        删除
                    </Button>
                </Space >
            ),
        }
    ];
    return (
        <div>
            <Table columns={columns} dataSource={paperList} />
            <Button type="primary" onClick={() => {
                setAddPaperInfoModalVisible(true);
            }}>添加论文
            </Button>
            <AddPaperInfoModal visible={addPaperInfoModalVisible} setVisible={setAddPaperInfoModalVisible} updatehandle={updatelist} />

            <Button type='primary' style={{ marginLeft: "10px" }} onClick={() => { setEditPaperStepsModalVisible(true) }}>
                论文阶段管理
            </Button>
            <EditPaperStepsModal visible={editPaperStepsModalVisible} setVisible={setEditPaperStepsModalVisible} updatehandle={updatelist} />
            <EditPaperInfoModal visible={editPaperInfoModalVisible} setVisible={setEditPaperInfoModalVisible} paperInfo={editPaperInfoRecord} updatehandle={updatelist} />
        </div>
    )
}
export default PaperMgmtList;
