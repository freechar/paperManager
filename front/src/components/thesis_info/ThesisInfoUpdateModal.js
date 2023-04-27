import { Modal, Form, Input } from 'antd';
import axios from 'axios';
import config from '../../config/config.json'
import { UseAuth } from '../auth';
const ThesisInfoUpdateModal = (props) => {
    const { token } = UseAuth();
    const onCancel = () => {
        props.setVisible(false);
    }
    const handleOk = () => {
        let formData = form.getFieldsValue(["title", "introduction"])
        let postData = new FormData();
        postData.append('thesis_id', props.ThesisId);
        postData.append('thesis_title', formData.title);
        postData.append('introduction', formData.introduction);
        axios.post(config.apiUrl + '/auth/thesis/update',postData ,{
            headers: {
                "Authorization": token
            }
        })
            .then(
                response => {
                    if (response.data.status === 'success') {
                        props.updatehandle();
                        Modal.success({
                            title: '修改成功',
                            content: '论文修改成功',
                            onOk: () => {
                                props.setVisible(false);
                                
                            }
                        })
                        
                    }
                    else {
                        Modal.error({
                            title: '修改失败',
                            content: response.data.msg,
                        })
                    }
                })
            .catch(
                error => {
                    console.error(error);
                })
    }
    const [form] = Form.useForm();
    const title = props.Title;
    const introduction = props.Introduction;
    return (<Modal
        open={props.visible}                
        title="修改论文信息"
        onCancel={onCancel}
        onOk={handleOk}
    >
        <Form form={form} layout="vertical" initialValues={{ title, introduction }}>
            <Form.Item label="论文标题" name="title" rules={[{ required: true, message: '请输入论文标题' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="论文简介" name="introduction" rules={[{ required: true, message: '请输入论文简介' }]}>
                <Input.TextArea rows={4} />
            </Form.Item>
        </Form>
    </Modal>
    )
}
ThesisInfoUpdateModal.defaultProps = {
    updatehandle: () => { },
    Introduction: '',
    Title: '',
}
export default ThesisInfoUpdateModal;
