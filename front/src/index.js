import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import reportWebVitals from './reportWebVitals';

import Login from "./components/login/Login"
import Home from "./components/home/Home"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Auth,ProtectedRoute } from './components/auth';
const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/home",
    element: <ProtectedRoute><Home/></ProtectedRoute>,
  },
  {
    path:"/login",
    element: <Login/>,
  },
  {
    path:"/",
    element:<div>This is root Page</div>,
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
