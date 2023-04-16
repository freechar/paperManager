import React, { useEffect, useState } from "react";
import { Layout, Form, Select, Button, Typography, message, Modal } from "antd";
import ProgressTracker from "../Steps";
import { useNavigate, useParams } from "react-router-dom";
import { UseAuth } from "../auth";
import axios from "axios";
import config from '../../config/config.json'
import UploadCardModal from "../thesis_info/UploadCardModal";
import ThesisInfoUpdateModal from "./ThesisInfoUpdateModal";
const { Header, Content } = Layout;
const { Option } = Select;
const { Title, Paragraph } = Typography;



const App = () => {
  // 选中的版本
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [thesisInfo, setThesisInfo] = useState({ Introduction: "", AuthorName: "", Reviewer: [], Stages: [], StageNow: 0, Versions: [], Name: "" })
  const [uploadCardVisible, setUploadCardVisible] = useState(false);
  const [userType, setUserType] = useState(null);
  const [updateThesisInfoModalVisible, setUpdateThesisInfoModalVisible] = useState(false);
  const { id } = useParams();
  const { token } = UseAuth();
  const navigate = useNavigate();
  // 处理表单提交
  const handleSubmit = (values) => {
    setSelectedVersion(values.version);
    // 跳转去论文详情页
    navigate("/home/paper/" + values.version)

  };

  const handleCommentPaper = () => {
    // 获取最新版本的论文
    // console.log(thesisInfo.Versions[thesisInfo.Versions.length - 1].ID)
    navigate("/home/paper/" + thesisInfo.Versions[thesisInfo.Versions.length - 1].ID)
  }

  const handleupdate = ()=> {
    var postData = new FormData();
    postData.append("thesis_id", id);
    axios.post(config.apiUrl + '/auth/thesisinfo', postData, {
      headers: {
        "Authorization": token
      }
    })
      .then(thesisInfoResponse => {
        if (thesisInfoResponse.data.status === "success") {
          // setThesisInfo(thesisInfoResponse.data.thesis_info)
          var resThesisInfo = thesisInfoResponse.data.thesis_info
          // 在这里获取用户信息
          axios.get(config.apiUrl + '/auth/userinfo', {
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
                Reviewer: resThesisInfo.Checkers.map(item => item.UserName),
                Stages: resThesisInfo.Stage.StageNames.split("#"),
                StageNow: resThesisInfo.StagesNow,
                Versions: resThesisInfo.ThesisFiles,
                Name: resThesisInfo.Name
              });
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
  }

  // 初始化论文信息
  useEffect(() => {
    handleupdate();
  }, [id, token])

  const names = thesisInfo.Reviewer ? thesisInfo.Reviewer.map(item => item).join(" ") : '';

  return (
    <Layout>
      <Header style={{ height: '15%' }}>
        <Title style={{ color: "white", height: "100%" }}>{thesisInfo.Name}</Title>
      </Header>
      <Content style={{ padding: "50px" }}>
        <div style={{ marginBottom: "30px" }}>
          <Title level={3}>论文简要信息</Title>
          <Paragraph>
            {thesisInfo.Introduction}
          </Paragraph>
          <Paragraph>
            作者: {thesisInfo.AuthorName} <br />
            本文指导教师: {names} <br />
            当前进程: {thesisInfo.Stages.length === 0 ? "" : thesisInfo.Stages[thesisInfo.StageNow]}
          </Paragraph>
        </div>
        <div>
          <ProgressTracker steps={thesisInfo.Stages} currentStep={thesisInfo.Stages.length === 0 ? "" : thesisInfo.Stages[thesisInfo.StageNow]} />
        </div>
        <div>
          <Title level={3}>请选择一个论文版本</Title>
          <Form onFinish={handleSubmit}>
            <Form.Item
              name="version"
              rules={[{ required: true, message: "请选择一个版本" }]}
            >
              <Select placeholder="选择一个版本">
                {thesisInfo.Versions.map((version) => (
                  <Option key={version.ID} value={version.ID}>
                    {version.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                确认预览
              </Button>
            </Form.Item>
          </Form>
          <Button type="primary" onClick={() => { setUploadCardVisible(true) }}>
            上传新的版本
          </Button>
          <UploadCardModal visible={uploadCardVisible} setVisible={setUploadCardVisible} thesisId={id}/>
          <Button style={{ marginLeft: "10px" }} type="primary" onClick={handleCommentPaper}>
            评阅论文
          </Button>
          {userType !== 0 &&
            <>
              <Button
                style={{ marginLeft: "10px" }}
                type="primary"
                onClick={() => {
                  setUpdateThesisInfoModalVisible(true);
                  console.log(updateThesisInfoModalVisible)
                }}>
                修改论文信息
              </Button>

            </>

          }

        </div>
        <ThesisInfoUpdateModal
          visible={updateThesisInfoModalVisible}
          setVisible={setUpdateThesisInfoModalVisible}
          Title={thesisInfo.Name}
          Introduction={thesisInfo.Introduction}
          ThesisId={id}
          updatehandle={handleupdate}
        />
      </Content>
    </Layout >
  );
};

export default App;


