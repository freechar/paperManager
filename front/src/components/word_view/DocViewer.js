import { DocumentEditor } from "@onlyoffice/document-editor-react";
import './word.css'
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UseAuth } from "../auth";
import React, { useRef } from "react";
import axios from "axios";
import { message } from "antd";
import config from "../../config/config.json";
const DocPreview = () => {

    var onDocumentReady = function (event) {
        // console.log(window.DocEditor.instances.docxEditor.destroyEditor());
        console.log("Document is loaded");
    };
    // 根据id查地址
    const [Path, setPath] = useState("")
    const { token } = UseAuth()
    const { id } = useParams();
    useEffect(() => {
        var data = new FormData();
        data.append("thesis_file_id", id);
        axios.post(config.apiUrl + '/auth/getpath', data, {
            headers: {
                "Authorization": token
            }
        })
            .then(response => {
                if (response.data.status === "success") {
                    setPath(response.data.path)
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
                    "title": "Example Document Title.docx",
                    "url": config.docxFileUrl + "/" + Path,
                },
                "documentType": "word",
                "editorConfig": {
                    "mode": "view"
                },
            }}
            events_onInfo={onDocumentReady}
        />
    </div>
    )
}


export default DocPreview