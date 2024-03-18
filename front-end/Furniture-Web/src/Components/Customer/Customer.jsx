import React from "react";
import Sidebar from "./Sidebar";
import Manager from "./Manager.jsx";
import MainContent from "./MainContent";
import { Routes, Route } from "react-router-dom"
import Project from "./Project";
import Quotation from "./Quotation";
import { useEffect } from "react";

function Customer() {

    return (
        <div className="flex">
            <Sidebar />
            <Routes>
                <Route path="" element={<MainContent />} />
                <Route path="manager/*" element={<Manager />}>
                    <Route path="project" element={<Project />} />
                    <Route path="quotation" element={<Quotation />} />
                    <Route path="history" element={<History />} />
                </Route>
            </Routes>
        </div>
    )
}

export default Customer