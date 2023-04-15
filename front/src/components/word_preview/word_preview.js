import { Layout } from 'antd';
import DocViewer from '../word_view/DocViewer';
import CommentSide from '../comment/comment_side';
import { useParams } from "react-router-dom";
const { Sider, Content } = Layout;
const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#108ee9',
  };
  const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#ffffff',
    backgroundColor: '#ffffff',
  };
const DocPreview = () => {
    const { id } = useParams();
    return (
        <Layout style={{ minHeight: '82vh' }}>
            <Content style={contentStyle}> 
                <DocViewer id={id} />
            </Content>
            <Sider style={siderStyle} width="20%">
                <CommentSide />
            </Sider>
        </Layout>
    )
}
export default DocPreview;