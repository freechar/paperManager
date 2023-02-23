import React from 'react';
import { Card} from 'antd';
import "./papercard.css"
import { useNavigate } from 'react-router-dom';
const PaperCard = (props) => {
    const navigate = useNavigate();
    const onClick= (cardKey)=> {
        navigate("/home/thesisinfo/"+props.ThesisId)
    }
    return (
        <Card className="paper-card" onClick={onClick} key={"111"}>
            <h3>{props.title}</h3>
            <p>Author: {props.author}</p>
            <p>Status: {props.status}</p>
        </Card>
    );
};

export default PaperCard;