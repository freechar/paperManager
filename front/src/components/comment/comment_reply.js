import React, { useState } from 'react';
import { Image, Upload } from 'antd';
import { Comment } from '@ant-design/compatible';

import ReactMarkdown from 'react-markdown';

// 定义一个自定义的图片组件
const CustomImage = (props) => {
  // 获取图片源地址
  const src = props.src;
  // 返回antd的Image组件
  return <Image src={src} />;
};

// 定义一个页面组件
const Page = () => {
  // 定义一个状态变量用于存储用户输入的评论内容
  const [comment, setComment] = useState('');

  // 定义一个处理文件变化事件的函数
  const handleFileChange = (info) => {
    console.log(info)
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
    <div>
      {/* 使用Comment组件渲染回复框 */}
      <Comment
        // 设置头像
        avatar="https://example.com/avatar.jpg"
        // 设置作者
        author="张三"
        // 设置内容，使用ReactMarkdown组件渲染评论内容 */}
        content={
          <ReactMarkdown
            // 使用renderers属性指定自定义的图片组件 */}
            renderers={{ image: CustomImage }}
          >
            {comment}
          </ReactMarkdown>
        }
        // 设置时间
        datetime="2023-03-17 14:09:59"
      />
      {/* 使用Upload组件提供上传文件功能 */}
      <Upload onChange={handleFileChange}>
        {/* 使用按钮作为触发器 */}
        <button>点击上传</button>
      </Upload>
    </div>
  );
};

export default Page;