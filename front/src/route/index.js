import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Login from "../components/login/Login"
import Home from "../components/home/Home"
function RouterConfig() {
    return (
        <HashRouter>
            <Routes>
                <Route path="" element={<div>111111</div>} />
                <Route path="/login" element={Login} />
            </Routes>
        </HashRouter>
    )
}

export default RouterConfig