import React, { useState } from 'react';
import { Layout, message, Form, Select, Button } from 'antd';
import DocViewer from '../word_view/DocViewer';
import CommentSide from '../comment/comment_side';
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import axios from 'axios';
import { UseAuth } from "../auth";
import config from '../../config/config.json'
import DiffViewer from '../word_view/DiffViewer';
import CheackFormat from './check_format';
const { Sider, Content } = Layout;
const { Option } = Select;
const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#108ee9',
};
const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#ffffff',
    backgroundColor: '#ffffff',
};
const DocPreview = () => {
    const { id } = useParams();
    const [userType, setUserType] = useState(0)
    const { token } = UseAuth();
    const [thesisInfo, setThesisInfo] = useState([])
    const [diffVisible, setDiffVisible] = useState(false)
    const [diffPath, setDiffPath] = useState("")
    useEffect(() => {
        axios.get(config.apiUrl + '/auth/userinfo', {
            headers: {
                "Authorization": token
            }
        })
            .then(userInfoResponse => {
                if (userInfoResponse.data.status === "success") {
                    var resUserInfo = userInfoResponse.data.user_info
                    setUserType(resUserInfo.UserType)
                } else {
                    message.error(userInfoResponse.data.msg)
                }
            })
        // 获取论文信息
        axios.get(config.apiUrl + '/auth/getthesisIdbyFileId', {
            params: {
                thesis_file_id: id
            },
            headers: {
                "Authorization": token
            }
        })
            .then(res => {
                if (res.data.status === "success") {
                    let thesisId = res.data.thesis_id;
                    var postData = new FormData();
                    postData.append("thesis_id", thesisId);
                    axios.post(config.apiUrl + '/auth/thesisinfo', postData, {
                        headers: {
                            "Authorization": token
                        }
                    })
                        .then(thesisInfoResponse => {
                            if (thesisInfoResponse.data.status === "success") {
                                var resThesisInfo = thesisInfoResponse.data.thesis_info
                                setThesisInfo(resThesisInfo.ThesisFiles)
                            } else {
                                message.error(thesisInfoResponse.data.msg)
                            }
                        })
                }
            })
    }, [token, id])

    const GetDiffPath = (thesisId, oldFileId, newFileId) => {
        // post 方法
        let postData = new FormData();
        postData.append("thesis_file_id_bef", oldFileId);
        postData.append("thesis_file_id_now", newFileId);
        axios.post(config.apiUrl + '/auth/diff', postData, {
            headers: {
                "Authorization": token
            }
        })
            .then(res => {
                if (res.data.status === "success") {
                    let Path = res.data.path;
                    setDiffPath(Path)
                    setDiffVisible(true)
                    return Path;
                } else {
                    message.error("对比差异失败");
                    return null;
                }
            })
    }


    const handleSubmit = (values) => {
        // 对比差异
        // 请求对比差异接口
        GetDiffPath(id, values.version, id);
    };

    return (
        <div style={{ minHeight: '82vh' }}>
            {userType !== 0 ? <Layout style={{ minHeight: '82vh' }}>
                <Content style={contentStyle}>
                    {diffVisible ?
                        <div style={{
                            // 左右布局
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',

                        }}>
                            <div style={{
                                width: '100%',
                            }}>
                                <DiffViewer path={diffPath} title={diffPath} id={id} />
                            </div>

                            <div style={{
                                width: '100%',
                            }}>
                                <DocViewer id={id} />
                            </div>

                        </div>

                        :
                        <DocViewer id={id} />
                    }
                </Content>
                <Sider style={siderStyle} width="20%">
                    <CommentSide thesisFileId={id} />

                    {/* 这里编写对比功能 */}
                    <Form onFinish={handleSubmit}>
                        <Form.Item
                            name="version"
                            rules={[{ required: true, message: "请选择一个版本" }]}
                        >
                            <Select placeholder="选择一个版本">
                                {thesisInfo.filter(function (item) {
                                    return item.ID < id;
                                }).map((version) => (
                                    <Option key={version.ID} value={version.ID}>
                                        {version.Name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ marginLeft: "10px" }}>
                                对比差异
                            </Button>
                            <Button type="primary" style={{ marginLeft: "10px" }} onClick={() => {
                                setDiffVisible(false)
                            }}>
                                返回原文档
                            </Button>
                        </Form.Item>
                    </Form>

                    <CheackFormat thesisFileId={id} />


                </Sider>
            </Layout>
                :
                <DocViewer id={id} style={{ minHeight: '82vh' }} />
            }
        </div>

    )
}
export default DocPreview;