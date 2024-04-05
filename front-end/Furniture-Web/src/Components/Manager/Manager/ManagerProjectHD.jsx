import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Pagination } from '@mui/material';
import Paper from '@mui/material/Paper';
import { getRequestOfCustomer, unlockRequest } from '../../../util/managerHandle';
import RequestDetail from './RequestDetail';

function ManagerProjectHD() {

    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Thêm state để lưu trữ số trang hiện tại
    const [selectedProject, setSelectedProjects] = useState(null); // Thêm state

    useEffect(() => {
        const fetchData = async () => {
            try {
                //PROPOSAL_AWAITING_APPROVAL
                const response = await getRequestOfCustomer(currentPage, 6, 'PROPOSAL_AWAITING_APPROVAL');
                setProjects(response); // Lưu kết quả từ API vào state
                // console.log(response);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [currentPage]);

    const handlePageChange = (event, page) => {
        setCurrentPage(page); // Cập nhật state currentPage khi chuyển trang
    };

    console.log("Project", projects);

    const handleRowClick = (project) => {
        setSelectedProjects(project);
    }

    const handleClose = async (requestId) => {
        try {
            await unlockRequest(requestId);
            setSelectedProjects(null);
            setCurrentPage(1); // Reset current page to reload the project list
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex w-full flex-col h-full justify-between items-center overflow-auto'>
            {/* Manager View */}
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead style={{backgroundColor: "#B0C4DE"}}>
                        <TableRow>
                            <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#000080' }}>Mã dự án</TableCell>
                            <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#000080' }}>Trạng thái</TableCell>
                            <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#000080' }}>Giá sơ bộ</TableCell>
                            <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#000080' }}>Chi tiết</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow
                                key={project.id}>
                                <TableCell style={{ fontSize: '10px', fontWeight: '500' }}> {project.id}</TableCell>
                                <TableCell style={{ fontSize: '10px', fontWeight: '500', color: '#B8860B' }}>
                                    {project.employeeRequestStatusDescription}
                                </TableCell>
                                <TableCell style={{ fontSize: '10px', fontWeight: '500' }}>{project.proposal && project.proposal.price ? project.proposal.price : ''} VND</TableCell>
                                <TableCell style={{ fontSize: '10px', fontWeight: '600', cursor: 'pointer', color: '#483D8B', transition: 'color 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.color = '#FF0000'} // Change color on hover
                                    onMouseLeave={(e) => e.target.style.color = '#483D8B'} // Revert color when not hovered
                                    onClick={() => handleRowClick(project)}>Xem</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* End Manager View */}
            <Pagination count={10} onChange={handlePageChange} color='secondary' />
            {selectedProject && (

                <RequestDetail project={selectedProject} close={() => handleClose(selectedProject.id)} />

            )}
        </div>
    );
}

export default ManagerProjectHD
