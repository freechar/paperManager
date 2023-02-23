import React, { useEffect, useState } from "react";
import { Layout, Form, Select, Button, Typography, message } from "antd";
import ProgressTracker from "../Steps";
import { useNavigate, useParams } from "react-router-dom";
import { UseAuth } from "../auth";
import axios from "axios";
const { Header, Content } = Layout;
const { Option } = Select;
const { Title, Paragraph } = Typography;

// 模拟数据
const versions = [];

const App = () => {
  // 选中的版本
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [thesisInfo, setThesisInfo] = useState({ Introduction: "", AuthorName: "", Reviewer: [], Stages: [],StageNow:0,Versions:[]})
  const { id } = useParams();
  const { token } = UseAuth();
  const navigate = useNavigate();
  // 处理表单提交
  const handleSubmit = (values) => {
      setSelectedVersion(values.version);
      // 跳转去论文详情页
      navigate("/home/paper/"+values.version)

  };

  // 初始化论文信息
  useEffect(() => {
    var postData = new FormData();
    postData.append("thesis_id", id);
    axios.post('http://127.0.0.1:8080/auth/thesisinfo', postData, {
      headers: {
        "Authorization": token
      }
    })
      .then(thesisInfoResponse => {
        if (thesisInfoResponse.data.status === "success") {
          // setThesisInfo(thesisInfoResponse.data.thesis_info)
          var resThesisInfo = thesisInfoResponse.data.thesis_info
          console.log(resThesisInfo)
          // 在这里获取用户信息
          axios.get('http://127.0.0.1:8080/auth/userinfo', {
            params: {
              user_id: thesisInfoResponse.data.thesis_info.Author
            },
            headers: {
              "Authorization": token
            }
          })
            .then(userInfoResponse => {
              var resUserInfo = userInfoResponse.data.user_info
              setThesisInfo({
                Introduction: resThesisInfo.Introduction,
                AuthorName: resUserInfo.UserName,
                Reviewer:resThesisInfo.Checkers.map(item=>item.UserName),
                Stages:resThesisInfo.Stage.StageNames.split("#"),
                StageNow: resThesisInfo.StagesNow,       
                Versions: resThesisInfo.ThesisFiles
              })
            })
            .catch(error => {
              console.log(error)
            })


        } else {
          message.error(thesisInfoResponse.data.msg)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }, [id, token])


  const names = thesisInfo.Reviewer ? thesisInfo.Reviewer.map(item=>item).join(" ") : '';
  return (
    <Layout>
      <Header style={{ height: '15%' }}>
        <Title style={{ color: "white", height: "100%" }}>Paper Info and Preview</Title>
      </Header>
      <Content style={{ padding: "50px" }}>
        <div style={{ marginBottom: "30px" }}>
          <Title level={3}>Paper Information</Title>
          <Paragraph>
            {thesisInfo.Introduction}
          </Paragraph>
          <Paragraph>
            Author: {thesisInfo.AuthorName} <br />
            Reviewer: {names} <br />
            Progress: {thesisInfo.Stages.length===0 ? "":thesisInfo.Stages[thesisInfo.StageNow]}
          </Paragraph>
        </div>
        <div>
          <ProgressTracker steps={thesisInfo.Stages} currentStep={thesisInfo.Stages.length===0 ? "":thesisInfo.Stages[thesisInfo.StageNow]} />
        </div>
        <div>
          <Title level={3}>Select a Paper Version</Title>
          <Form onFinish={handleSubmit}>
            <Form.Item
              name="version"
              rules={[{ required: true, message: "Please select a version" }]}
            >
              <Select placeholder="Select a version">
                {thesisInfo.Versions.map((version) => (
                  <Option key={version.ID} value={version.ID}>
                    {version.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Confirm
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary">
                Upload Paper
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default App;


