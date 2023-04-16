import { useEffect, useState } from 'react';
import { Modal, Button, Upload, message, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UseAuth } from '../auth';
import axios from 'axios';
import config from '../../config/config.json'

import './selfStyle.css'

const UploadCard = (props) => {
    const setUploadCardVisible = props.setVisible
    const [fileList, setFileList] = useState([]);
    const [isUploadSuccess, setUploadSuccess] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [commentList, setCommentList] = useState([{
        "CommentID": "",
        "CommentText": "",
    }]);
    const { token } = UseAuth();
    useEffect(() => {
        // 获取评论列表
        axios.get(config.apiUrl + '/auth/getcommentsbythesisid', {
            params: {
                thesis_id: props.thesisId
            },
            headers: {
                "Authorization": token
            }
        })
            .then(response => {
                if (response.data.status === 'success') {
                    let comments = response.data.comments;
                    let commentList = [];
                    for (let i = 0; i < comments.length; i++) {
                        commentList.push({
                            CommentID: comments[i].ID,
                            CommentText: comments[i].CommentText
                        })
                    }
                    setCommentList(commentList);
                }
            })
    }, [token])


    const handleUploadCardCancel = () => {
        props.updatehandle()
        setUploadCardVisible(false);
    };
    const handleUpload = (info) => {
        const formData = new FormData();
        formData.append('file', fileList[0]);
        formData.append('thesis_id', props.thesisId);
        formData.append('solved_comment', selectedOptions);
        axios.post(config.apiUrl + '/auth/uploadthesisfile', formData, {
            headers: {
                "Authorization": token,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                if (response.data.status === 'success') {
                    setUploadSuccess(true);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleCommentSelection = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
        console.log(selectedOptions);
    }



    return (
        <Modal title="上传论文" open={props.visible} onOk={handleUploadCardCancel} onCancel={handleUploadCardCancel}>
            {
                isUploadSuccess ?
                    <div>
                        <p>上传成功</p>
                    </div> :
                    <div>
                        <Upload
                            onRemove={(file) => {
                                const index = fileList.indexOf(file);
                                const newFileList = fileList.slice();
                                newFileList.splice(index, 1);
                                setFileList(newFileList);
                            }}
                            beforeUpload={(file) => {
                                setFileList([file]);
                                return false;
                            }}
                            fileList={fileList}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>

                        </Upload>
                        <div>
                            <Checkbox.Group
                                options={commentList.map(({ CommentID, CommentText }) => ({ label: CommentText, value: CommentID }))}
                                onChange={handleCommentSelection}
                                style={{ display: 'flex', flexDirection: 'column', marginXS: '0px' }}
                                className="selfClass"
                            />
                        </div>
                        <Button onClick={handleUpload} disabled={fileList.length === 0}>提交</Button>
                    </div>
            }

        </Modal>
    )
}
UploadCard.defaultProps = {
    updatehandle: () => { },
}
export default UploadCard;  