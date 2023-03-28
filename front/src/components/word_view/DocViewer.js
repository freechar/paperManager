import { DocumentEditor } from "@onlyoffice/document-editor-react";
import './word.css'
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UseAuth } from "../auth";
import React from "react";
import axios from "axios";
import { message } from "antd";
import config from "../../config/config.json";
const DocPreview = () => {

    var onDocumentChange = function (event) {
        // console.log(window.DocEditor.instances.docxEditor.destroyEditor());
        console.log(event);
    };
    // 根据id查地址
    const [DocInfo, setInfo] = useState({ Name: "", Path: "" })
    const { token } = UseAuth()
    const { id } = useParams();
    useEffect(() => {
        var data = new FormData();
        data.append("thesis_file_id", id);
        axios.post(config.apiUrl + '/auth/getdocinfo', data, {
            headers: {
                "Authorization": token
            }
        })
            .then(response => {
                if (response.data.status === "success") {
                    setInfo({
                        Name: response.data.Info.Name,
                        Path: response.data.Info.Path
                    })
                } else {
                    message.error("fail get docx path")
                }
            })
            .catch(error => {
                console.error(error);
            })

    }, [id, token])
    return (<div style={{ height: '100%' }}>
        <DocumentEditor
            id="docxEditor"
            documentServerUrl={config.documentServerUrl}
            config={{
                "document": {
                    "fileType": "docx",
                    "key": "Khirz6zTPdfd7",
                    "title": DocInfo.Name + ".docx",
                    "owner": "11111",
                    "url": config.docxFileUrl + "/" + DocInfo.Path,
                    "permissions": {
                        "comment": true,
                        "edit": true,
                        "editCommentAuthorOnly": true,
                        "deleteCommentAuthorOnly": true,
                    }
                },
                "documentType": "word",
                "editorConfig": {
                    "callbackUrl": config.docxFileUrl + "/save",
                },
            }}
            events_onDocumentStateChange={onDocumentChange}
        />
    </div>
    )
}


export default DocPreview