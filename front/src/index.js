import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from "./components/login/Login"
import PaperList from './components/paperlist/PaperList';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Auth, ProtectedRoute } from './components/auth';
import HomeLayout from './components/home/Home';
import ThesisInfo from './components/thesis_info/ThesisInfo';
import DocPreview from './components/word_preview/word_preview';
import TeacherComments from './components/comment/comment_list_page';
import CommentDetail from './components/comment/comment_detail'
import CommentReply from './components/comment/comment_reply'
import UserList from './components/user_mgmt/user_list';
import PaperMgmtList from './components/paper_mgmt/paper_list';
import CommentSide from './components/comment/comment_side';
import MyStuList from './components/my_student/my_student';
import CltThesisInfoList from './components/completion_thesisInfo_page/thesisInfoList.js';
import EvaPaperList from './components/evapaperlist/paperlist';
const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/home",
    element: <ProtectedRoute><HomeLayout /></ProtectedRoute>,
    children: [
      {
        path: "student/mypapers",
        element: <PaperList />,
      },
      {
        path: "teacher/cmtpaperlist",
        element: <MyStuList />,
      },
      { 
        path: "thesisinfo/:id",
        element: <ThesisInfo />,
      },
      {
        path: "paper/:id",
        element: <DocPreview />,
      },
      {
        path: "student/commentlist",
        element: <TeacherComments user_type={0}/>,
      },
      {
        path: "teacher/evapaperlist",
        element:<EvaPaperList/>
      },
      {
        path: "teacher/needtocompletion",
        element: <CltThesisInfoList/>   
      },
      {
        path: "teacher/commentlist",
        element: <TeacherComments user_type={1}/>,
      },
      {
        path: "comment/:id",
        element: <CommentDetail />
      },
      {
        path: "comment/reply",
        element: <CommentReply />
      },
      {
        path: "admin/usermgmt",
        element: <UserList/>
      },
      {
        path: "admin/papermgmt",
        element: <PaperMgmtList/>
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/test",
    element: <MyStuList />,
  },
  {
    path: "/",
    element: <div>This is root Page</div>,
  }
])



root.render(
  <React.StrictMode>
    <Auth>
      <RouterProvider router={router} />
    </Auth>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
