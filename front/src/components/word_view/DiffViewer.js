import { DocumentEditor } from "@onlyoffice/document-editor-react";
import './word.css'
import { useEffect, useState } from "react";
import { UseAuth } from "../auth";
import React from "react";
import uuid from 'react-uuid'
import axios from "axios";
import { message } from "antd";
import config from "../../config/config.json";



const DiffViewer = (props) => {

    var onDocumentChange = function (event) {
        // console.log(window.DocEditor.instances.docxEditor.destroyEditor());
        // console.log(event);
    };
    // 根据id查地址
    const Path = props.path;
    const ThesisFileId = props.id;
    console.log(config.docxFileUrl + "/data/" + Path);
    const Title = props.title;
    const { token } = UseAuth();

    const [userId, SetUserId] = useState(null)
    useEffect(()=>{
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
    },[token])
    return (<div style={{ height: '85vh' }}>
        <DocumentEditor
            id="docxEditor"
            documentServerUrl={config.documentServerUrl}
            config={{
                "document": {
                    "fileType": "docx",
                    "key": uuid(),
                    "title": Title + ".docx",
                    "owner": "11111",
                    "url": config.docxFileUrl + "/data/" + Path,
                    "permissions": {
                        "comment": false,
                        "edit": false,
                        "editCommentAuthorOnly": true,
                        "deleteCommentAuthorOnly": true,
                    }
                },
                "documentType": "word",
                "editorConfig": {
                    "callbackUrl": config.docxFileUrl + "/save/" + userId + "?thesisFileId=" + ThesisFileId,
                },
            }}
            events_onDocumentStateChange={onDocumentChange}
        />
    </div>
    )
}


export default DiffViewer