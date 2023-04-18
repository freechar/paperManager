import { DocumentEditor } from "@onlyoffice/document-editor-react";
import './word.css'
import { useEffect, useState } from "react";
import { UseAuth } from "../auth";
import React from "react";
import uuid from 'react-uuid'
import axios from "axios";
import { message } from "antd";
import config from "../../config/config.json";





const DocViewer = (props) => {

    var onDocumentChange = function (event) {
        // console.log(window.DocEditor.instances.docxEditor.destroyEditor());
        // console.log(event);
    };
    // 根据id查地址
    const [DocInfo, setInfo] = useState({ Name: "", Path: "", UpdateTime: "" });
    const { token } = UseAuth();
    const id = props.id;
    const [userId, SetUserId] = useState(null)
    useEffect(() => {
        var data = new FormData();
        data.append("thesis_file_id", id);
        axios.post(config.apiUrl + '/auth/getdocinfo', data, {
            headers: {
                "Authorization": token
            }
        })
            .then(response => {
                // console.log(response.data)
                if (response.data.status === "success") {
                    axios.get(config.apiUrl + '/auth/myuserid', {
                        headers: {
                            "Authorization": token
                        }
                    })
                        .then(userIdResponse => {
                            SetUserId(userIdResponse.data.user_id)
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    setInfo({
                        Name: response.data.Info.Name,
                        Path: response.data.Info.Path,
                        UpdateTime: response.data.Info.UpdatedAt
                    })
                } else {
                    message.error("fail get docx path")
                }
            })
            .catch(error => {
                console.error(error);
            })
    }, [id, token])
    return (<div style={{ height: '85vh' }}>
        <DocumentEditor
            id="docxEditor"
            documentServerUrl={config.documentServerUrl}
            config={{
                "document": {
                    "fileType": "docx",
                    "key": uuid(),
                    "title": DocInfo.Name + ".docx",
                    "owner": "11111",
                    "url": config.docxFileUrl + "/" + DocInfo.Path,
                    "permissions": {
                        "comment": true,
                        "edit": false,
                        "editCommentAuthorOnly": true,
                        "deleteCommentAuthorOnly": true,
                    }
                },
                "documentType": "word",
                "editorConfig": {
                    "callbackUrl": config.docxFileUrl + "/save/"+userId+"?thesisFileId=" +  id ,
                },
            }}
            events_onDocumentStateChange={onDocumentChange}
        />
    </div>
    )
}


export default DocViewer