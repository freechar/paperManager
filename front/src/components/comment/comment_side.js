import React, { useEffect, useState } from 'react';
import { List, Button, message } from 'antd';
import config from '../../config/config.json'
import { Comment } from '@ant-design/compatible';
import { UseAuth } from "../auth";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const listStyle = {
  background: '#fff',
  border: '1px solid #e8e8e8',
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
};



const CommentList = (props) => {
  const [commentList, setCommentList] = useState([])
  const { token } = UseAuth();
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(config.apiUrl + "/auth/solvedcomments", {
      params: {
        thesis_file_id: props.thesisFileId
      },
      headers: {
        'Authorization': token
      }
    })
      .then(
        res => {
          // console.log("solve comments");
          // console.log(res.data);
          if (res.data.status === "success") {

            let comments = [];
            for (let i = 0; i < res.data.comments.length; i++) {
              let comment = res.data.comments[i];
              comments.push({
                content: comment.CommentText,
                author: comment.Author.UserName,
                commentId: comment.ID,
              })
            }
            setCommentList(comments);
          }
        }
      )
  }, [])
  return (
    <List
      dataSource={commentList.map(({ content, author, commentId }) => ({
        author: author,
        avatar: config.apiUrl + "/assets/default_avatar.webp",
        content: content,
        commentid: commentId,
      }))}
      itemLayout="horizontal"
      style={listStyle}
      renderItem={props =>
        <List.Item style={{ background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', flexDirection: 'column' }}>
          <Comment {...props} style={{ width: "100%" }} />
          <div style={{ display: 'flex' }}>
            <Button type='primary' style={{ marginLeft: '30px' }} onClick={() => {
              let postData = new FormData();
              postData.append("comment_id", props.commentid);
              axios.post(config.apiUrl + "/auth/solvecomment", postData, {
                headers: {
                  'Authorization': token
                }
              })
                .then(
                  res => {
                    if (res.data.status === "success") {
                      // 删除该评论
                      let newCommentList = commentList.filter((comment) => {
                        return comment.commentId !== props.commentid;
                      })
                      setCommentList(newCommentList);
                      message.success("已解决");
                    }
                  }
                )
            }}>
              以解决
            </Button>
            <Button type='primary' style={{ marginLeft: '10px' }} onClick={() => {
              navigate('/home/comment/' + props.commentid)
            }}>
              转到详情
            </Button>
          </div>
        </List.Item>
      }
    />
  );
}
const comments = [
  {
    author: 'Alice',
    avatar: config.apiUrl + "/assets/default_avatar.webp",
    content: 'Lorem ipsum dolor sit amet',
  },
  {
    author: 'Dave',
    avatar: config.apiUrl + "/assets/default_avatar.webp",
    content: 'Ut enim ad minim veniam dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd`',
    refs: [],
  },
];

const CommentSide = (props) => (
  <div>
    <CommentList thesisFileId={props.thesisFileId} />
  </div>
);



export default CommentSide;
