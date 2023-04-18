import React, { useState } from 'react';
import { Layout, message } from 'antd';
import DocViewer from '../word_view/DocViewer';
import CommentSide from '../comment/comment_side';
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import axios from 'axios';
import { UseAuth } from "../auth";
import config from '../../config/config.json'
const { Sider, Content } = Layout;
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
    })
    return (
        <div style={{ minHeight: '82vh' }}>
            {userType !== 0 ? <Layout style={{ minHeight: '82vh' }}>
                <Content style={contentStyle}>
                    <DocViewer id={id} />
                </Content>
                <Sider style={siderStyle} width="20%">
                    <CommentSide thesisFileId={id} />
                </Sider>
            </Layout>
                :
                <DocViewer id={id} style={{ minHeight: '82vh' }} />
            }
        </div>

    )
}
export default DocPreview;