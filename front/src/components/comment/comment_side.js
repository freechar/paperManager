import React from 'react';
import { List, Button } from 'antd';
import config from '../../config/config.json'
import { Comment } from '@ant-design/compatible';

const listStyle = {
  background: '#fff',
  border: '1px solid #e8e8e8',
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
};

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    itemLayout="horizontal"
    style={listStyle}
    renderItem={props =>
      <List.Item style={{ background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', flexDirection: 'column' }}>
        <Comment {...props}   style={{ width: "100%"}}/>
        <div style={{ display: 'flex' }}>
          <Button type='primary' style={{ marginLeft: '30px' }} >
            以解决
          </Button>
          <Button type='primary' style={{ marginLeft: '10px' }}>
            转到详情
          </Button>
        </div>
      </List.Item>
    }
  />
);

// const CommentListItem = ({ author, content, avatar }) => (
//   <Comment
//     author={author}
//     avatar={<Avatar src={avatar} alt={author} />}
//     content={<p>{content}</p>}
//   />
// );

// const CommentListWithRefs = ({ comments }) => (
//   <List
//     dataSource={comments}
//     header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
//     itemLayout="horizontal"
//     renderItem={props => (
//       <Comment
//         {...props}
//         content={
//           <>
//             <p>{props.content}</p>
//             <CommentList comments={props.refs} />
//           </>
//         }
//       />
//     )}
//   />
// );



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

const CommentSide = () => (
  <div>
    <CommentList comments={comments} />
  </div>
);



export default CommentSide;
