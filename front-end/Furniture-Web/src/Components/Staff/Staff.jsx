import React from "react";
// import Sidebar from "./SideBar";
// import MainContent from "./MainContent";
import { Routes, Route } from "react-router-dom";
import RequestList from "./RequestList";
// import RequestDetails from "./RequestDetails";
import ProposalList from "./ProposalList";
import ProposalDetails from "./ProposalDetails";
import ProposalPdf from "./ProposalPdf";
import MainStaffPage from "./MainStaffPage";
import ManageRequestDetail from "./ManageRequestDetail";

function Staff() {
    return (
        <div className="flex">

            <Routes>
                <Route path="/" element={<MainStaffPage />} />
                <Route path="requestDetails/:id" element={<ManageRequestDetail />} />
                <Route path="requestList" element={<RequestList />} />
                <Route path="proposalList" element={<ProposalList />} />
                <Route path="proposalDetails/:id" element={<ProposalDetails />} />
                <Route path="proposalPdf/:id" element={<ProposalPdf />} />
            </Routes>

        </div>
    )
}

export default Staff;
