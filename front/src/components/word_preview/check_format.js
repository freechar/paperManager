import React, { useEffect, useState } from 'react';
import { List, Typography } from 'antd';
import config from '../../config/config.json'
import { Comment } from '@ant-design/compatible';
import { UseAuth } from "../auth";
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
const CheackFormat = (props) => {
    const thesisFileId = props.thesisFileId;
    const { token } = UseAuth();
    const navigate = useNavigate();
    const [formatList, setFormatList] = useState([{ message: "", paragraph: "" }])
    const { Text } = Typography;
    useEffect(() => {
        axios.get(config.apiUrl + "/auth/getformat", {
            params: {
                thesis_file_id: thesisFileId
            },
            headers: {
                'Authorization': token
            }
        })
            .then(
                res => {
                    var formatList = res.data.format;
                    var list = [];
                    for (var i = 0; i < formatList.length; i++) {
                        var format = formatList[i];
                        list.push({
                            message: unescape(format.Message.replace(/\\u/g, "%u")),
                            paragraph: format.Paragraph
                        })
                    }
                    setFormatList(list);
                }
            )
    }, [token])
    return (
        <div style={{
            height: '250px',
            overflowY: 'auto'
        }}>
            <List
                dataSource={formatList}
                renderItem={item => (
                    <List.Item>
                        <div style={{
                            // 纵向排列
                            display: 'flex',
                            flexDirection: 'column',
                            // 左对齐
                            justifyContent: 'flex-start',
                            float: 'left',
                            textAlign: 'left',

                        }}>
                            <Text type='danger'>{item.message}</Text>
                            <Text>{"相关文段： "+item.paragraph}</Text>
                        </div>

                    </List.Item>)}
            />
        </div>

    )
}


export default CheackFormat;