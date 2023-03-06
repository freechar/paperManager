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
import DocPreview from './components/word_view/DocViewer';
import ThesisInfo from './components/thesis_info/ThesisInfo';
import TeacherComments from './components/comment/comment_page';
const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/home",
    element: <ProtectedRoute><HomeLayout/></ProtectedRoute>,
    children: [
      {
        path: "student/mypapers",
        element: <PaperList />,
      },
      {
        path:"thesisinfo/:id",
        element: <ThesisInfo/> ,
      },
      {
        path:"paper/:id",
        element: <DocPreview/>,
      },
      {
        path:"commentlist",
        element: <TeacherComments/>,
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/test",
    element:<TeacherComments/> ,
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
