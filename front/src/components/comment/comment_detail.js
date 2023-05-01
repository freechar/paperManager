import React, { useEffect, useState } from 'react';
import { Layout, Typography, List, Form, Input, Button, message } from 'antd';
import { Image, Upload } from 'antd';
import { Comment } from '@ant-design/compatible';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import config from '../../config/config.json'
import { UseAuth } from "../auth";
import { useParams } from "react-router-dom";
import userEvent from '@testing-library/user-event';
import { useForm } from 'rc-field-form';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const markdown = `
# This is a title

This is a paragraph with some **bold** text.

- This is a list item
- Another item

[This is a link](https://example.com)
`;


// 定义一个评论表单组件
const CommentForm = ({ UpdatedComment }) => {
    const [comment, setComment] = useState('');
    const { token } = UseAuth();
    const { id } = useParams();
    const [form] = Form.useForm();
    const updateComment = (id, token) => {
        var post_data = new FormData();
        post_data.append("comment_id", id);
        axios.post(config.apiUrl + "/auth/commentinfo", post_data, {
            headers: {
                "Authorization": token
            }
        })
            .then(commentInfoResponse => {
                if (commentInfoResponse.data.status === "success") {
                    commentInfoResponse.data.comment.UpdatedAt = commentInfoResponse.data.comment.UpdatedAt.replace("T", " ").replace(/\.\d{3}\+\d{2}:\d{2}$/, "");
                    var commentInfo = {
                        commentText: commentInfoResponse.data.comment.CommentText,
                        commentAuthor: commentInfoResponse.data.comment.Author.UserName,
                        UpdatedAt: commentInfoResponse.data.comment.UpdatedAt,
                        CommentReplies: commentInfoResponse.data.comment.Replies,
                        QuoteText: commentInfoResponse.data.comment.QuoteText,
                    }
                    UpdatedComment(commentInfo);
                } else {
                    message.error(commentInfoResponse.data.message);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    // 定义表单提交事件处理函数
    const handleSubmit = (values) => {
        // 获取表单输入值
        const { content } = values;
        // 使用axios发送请求
        var post_data = new FormData();
        post_data.append("comment_id", id);
        post_data.append("reply_text", content);
        axios.post(config.apiUrl + "/auth/commentreply/add", post_data, {
            headers: {
                "Authorization": token
            }
        })
        setComment("");
        // 清空
        form.setFieldValue("content", comment);
        updateComment(id, token);
    };
    const handleFileChange = (info) => {
        // console.log(info)
        // // 如果文件状态是done（已完成）
        // if (info.file.status === 'done') {
        //   // 获取文件响应数据（假设是返回了文件地址）
        //   const fileUrl = info.file.response;
        //   // 在评论内容末尾添加一行markdown语法表示插入该文件作为图片
        //   setComment(comment + `\n"ddddddddddddddddddd"`);
        // }
        setComment(comment + `\n"dddddddddddddeddfsasdfadsfdddddddd"`);

    };

    return (
        <>
            <Form form={form} onFinish={handleSubmit}>
                <Form.Item name="content" label="Comment" rules={[{ required: true }]} >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            {/* 使用Upload组件提供上传文件功能 */}
            {/* <Upload onChange={handleFileChange}> */}
            {/* 使用按钮作为触发器 */}
            {/* <button>插入图片</button> */}
            {/* </Upload> */}
        </>


    );
};

// 定义一个页面组件
const Page = () => {
    const [comment, setComment] = useState({
        commentText: "",
        commentAuthor: "",
        UpdatedAt: "",
        CommentReplies: [{
            Author: "",
            UpdatedAt: "",
            ReplyText: "",
            QuoteText: "",
        }],
    });
    const { id } = useParams();
    const { token } = UseAuth();

    useEffect(() => {
        var post_data = new FormData();
        post_data.append("comment_id", id);
        axios.post(config.apiUrl + "/auth/commentinfo", post_data, {
            headers: {
                "Authorization": token
            }
        })
            .then(commentInfoResponse => {
                if (commentInfoResponse.data.status === "success") {
                    commentInfoResponse.data.comment.UpdatedAt = commentInfoResponse.data.comment.UpdatedAt.replace("T", " ").replace(/\.\d{3}\+\d{2}:\d{2}$/, "");
                    var commentInfo = {
                        commentText: commentInfoResponse.data.comment.CommentText,
                        commentAuthor: commentInfoResponse.data.comment.Author.UserName,
                        UpdatedAt: commentInfoResponse.data.comment.UpdatedAt,
                        CommentReplies: commentInfoResponse.data.comment.Replies,
                        QuoteText: commentInfoResponse.data.comment.QuoteText,
                    }
                    setComment(commentInfo);
                } else {
                    message.error(commentInfoResponse.data.message);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, token]);
    return (
        <Layout>
            <Header>Antd React Demo</Header>
            <Content style={{ padding: '24px' }}>
                {/* 使用Typography组件创建一个主题标题 */}
                <Title level={2}>{comment.commentText}</Title>
                {/* 使用Typography组件创建一个副标题 */}
                <Typography.Title level={4}>创建者: {comment.commentAuthor} 创建于: {comment.UpdatedAt}</Typography.Title>
                {/* 如果QuoteText不等于“” 则显示 */}
                {comment.QuoteText !== "" && <Paragraph>
                    相关文段: {comment.QuoteText}
                </Paragraph>}
                {/* 使用List组件展示已有的评论列表 */}
                <List
                    dataSource={comment.CommentReplies}
                    renderItem={(item) => (
                        <List.Item style={{
                            width: '100%',
                        }}>
                            <Comment
                                // 设置头像
                                avatar={config.apiUrl + "/assets/default_avatar.webp"}
                                // 设置作者
                                author={item.Author.UserName}
                                // 设置内容，使用ReactMarkdown组件渲染markdown文本 */}
                                content={<ReactMarkdown>{item.ReplyText}</ReactMarkdown>}
                                // 设置时间
                                datetime={item.UpdatedAt.replace("T", " ").replace(/\.\d{3}\+\d{2}:\d{2}$/, "")}
                                style={{
                                    width: '100%',
                                }}
                            />
                        </List.Item>

                    )}
                />
                {/* 使用CommentForm组件创建一个评论表单 */}
                <CommentForm UpdatedComment={setComment} />
            </Content>

        </Layout>
    );
};

export default Page;