import { message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PaperCard from './PaperCard';
import { UseAuth } from '../auth';
import config from '../../config/config.json'
const PaperList = () => {
    const [thesisesData, setPaperData] = useState({
        Thesises: [],
        UserName: "",
    });
    const { token } = UseAuth();
    useEffect(() => {
        axios.get(config.apiUrl + '/auth/thesises', {
            headers: {
                "Authorization": token
            }
        })
            .then(response => {
                if (response.data.status === 'success') {
                    setPaperData(response.data.thesises);
                } else {
                    message.error(response.data.msg)
                }
            })
            .catch(
                error => {
                    console.log(error)
                }
            )
    }, [token])


    const paperCards = thesisesData.Thesises.map((data, index) => {
        return (
            <div key={index} style={cardStyle}>
                <PaperCard key={index} title={data.Name} author={thesisesData.UserName} status={data.Stage.StageNames.split("#")[data.StagesNow]} ThesisId={data.ID} />
            </div>
        )
    });

    return (
        <div style={cardListContainer}>
            {paperCards}
        </div>
    );
};

const cardStyle = {
    width: '200px',
    height: '250px',
    marginRight: '30px',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    borderRadius: '5px'
};

const cardListContainer = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'

};



export default PaperList;