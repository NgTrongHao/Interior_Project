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
                const response = await getRequestOfCustomer(currentPage, 4, 'PROPOSAL_AWAITING_APPROVAL');
                setProjects(response); // Lưu kết quả từ API vào state
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [currentPage]);

    const handlePageChange = (event, page) => {
        setCurrentPage(page); // Cập nhật state currentPage khi chuyển trang
    };

    console.log("Projectssss", projects);

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
        <div className='flex flex-col w-5/6'>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#000080' }}>Project ID</TableCell>
                            <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#000080' }}>Status</TableCell>
                            <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#000080' }}>Price</TableCell>
                            <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#000080' }}>Detail</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow
                                key={project.id}>
                                <TableCell style={{ fontSize: '10px', fontWeight: '500' }}> {project.id}</TableCell>
                                <TableCell style={{ fontSize: '10px', fontWeight: '500', color: '#B8860B' }}>
                                    {project.employeeRequestStatus === 'PROPOSAL_AWAITING_APPROVAL' ? 'WAITING APPROVAL' : ''}
                                </TableCell>
                                <TableCell style={{ fontSize: '10px', fontWeight: '500' }}>{project.price}</TableCell>
                                <TableCell style={{ fontSize: '10px', fontWeight: '600', cursor: 'pointer', color: '#483D8B', transition: 'color 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.color = '#FF0000'} // Change color on hover
                                    onMouseLeave={(e) => e.target.style.color = '#483D8B'} // Revert color when not hovered
                                    onClick={() => handleRowClick(project)}>View</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination count={10} onChange={handlePageChange} color='secondary' />
            {selectedProject && (
                <RequestDetail project={selectedProject} close={() => handleClose(selectedProject.id)} />
            )}
        </div>
    );
}

export default ManagerProjectHD