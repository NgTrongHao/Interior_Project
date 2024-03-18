import React from "react";
import Sidebar from "./SideBar";
import MainContent from "./MainContent";
import { Routes, Route } from "react-router-dom";
import RequestList from "./RequestList";
import RequestDetails from "./RequestDetails";
import ProposalList from "./ProposalList";
import ProposalDetails from "./ProposalDetails";
import ProposalPdf from "./ProposalPdf";

function Staff() {
    return (
        <div className="flex">
            <Sidebar />
            <Routes>
                <Route path="/" element={<MainContent />} />
                <Route path="requestDetails/:id" element={<RequestDetails />} />
                <Route path="requestList" element={<RequestList />} />
                <Route path="proposalList" element={<ProposalList />} />
                <Route path="proposalDetails/:id" element={<ProposalDetails/>} />
                <Route path="proposalPdf/:id" element={<ProposalPdf/>} />
            </Routes>

        </div>
    )
}

export default Staff;
