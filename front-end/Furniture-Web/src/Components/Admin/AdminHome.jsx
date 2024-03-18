import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Modal from 'react-modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Sidebar from './Sidebar';
import Cookies from 'js-cookie';

function getToken() {
    return Cookies.get('token');
}

function AdminHome() {
    const [employees, setEmployees] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetchEmployees();
        fetchRoles();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('JWT Token is not available');
            }

            const response = await fetch("http://localhost:8080/api/v1/admin/getAllEmployee?page=1&pageSize=10", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchRoles = async () => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('JWT Token is not available');
            }

            const response = await fetch("http://localhost:8080/api/v1/admin/roles", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const roles = await response.json();
            setRoles(roles);
            console.log("Roles:", roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleEdit = async (id) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('JWT Token is not available');
            }

            const response = await fetch(`http://localhost:8080/api/v1/admin/getEmployee/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error getting employee information');
            }

            const employee = await response.json();
            setSelectedEmployee(employee);
            openModal();
        } catch (error) {
            console.error('Error handling edit:', error);
        }
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setSelectedEmployee({});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = getToken();
            if (!token) {
                throw new Error('JWT Token is not available');
            }

            let url = `http://localhost:8080/api/v1/admin/addEmployee`;
            let method = 'POST';
            if (selectedEmployee.id) {
                url = `http://localhost:8080/api/v1/admin/updateEmployee/${selectedEmployee.id}`;
                method = 'PATCH';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedEmployee)
            });

            if (!response.ok) {
                throw new Error(`Error ${selectedEmployee.id ? 'updating' : 'adding'} employee`);
            }

            setIsOpen(false);
            fetchEmployees();
        } catch (error) {
            console.error(`Error ${selectedEmployee.id ? 'updating' : 'adding'} employee:`, error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedEmployee({
            ...selectedEmployee,
            [name]: value
        });
    };

    const handleStatusChange = async (id, status) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('JWT Token is not available');
            }

            const response = await fetch(`http://localhost:8080/api/v1/admin/${status}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error updating employee status');
            }

            const updatedEmployees = employees.map(employee => {
                if (employee.id === id) {
                    return {
                        ...employee,
                        status: status
                    };
                }
                return employee;
            });
            setEmployees(updatedEmployees);
        } catch (error) {
            console.error('Error updating employee status:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('JWT Token is not available');
            }

            const response = await fetch(`http://localhost:8080/api/v1/admin/${false}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error deleting employee');
            }

            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };


    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4">
                <div className="mb-4">
                    <Button variant="contained" onClick={() => openModal()}>
                        Add Employee
                    </Button>
                </div>
                <table className="w-full min-w-full shadow-md rounded-t-md overflow-x-auto">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Phone</th>
                            <th className="px-4 py-2 text-left">Username</th>
                            <th className="px-4 py-2 text-center">Status</th>
                            <th className="px-4 py-2 text-left">Full Name</th>
                            <th className="px-4 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr key={employee.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                                <td className="px-4 py-2">{employee.id}</td>
                                <td className="px-4 py-2">{employee.email}</td>
                                <td className="px-4 py-2">{employee.phone}</td>
                                <td className="px-4 py-2">{employee.username}</td>
                                <td className="px-4 py-2 text-center">
                                    <span className={`inline-block w-2 h-2 rounded-full ${employee.status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                </td>
                                <td className="px-4 py-2">{employee.full_name}</td>
                                <td className="px-4 py-4 text-center">
                                    <div className="flex justify-center space-x-2">
                                        {employee.status ? (
                                            <>
                                                <button className="inline-block px-2 py-1 text-sm font-medium rounded-md bg-red-500 text-white" onClick={() => handleDelete(employee.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </button>
                                                <button className="inline-block px-2 py-1 text-sm font-medium rounded-md bg-blue-500 text-white" onClick={() => handleEdit(employee.id)}>
                                                    <EditIcon fontSize="small" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="inline-block px-2 py-1 text-sm font-medium rounded-md bg-green-500 text-white" onClick={() => handleStatusChange(employee.id, true)}>
                                                    Reactivate
                                                </button>
                                                <button className="inline-block px-2 py-1 text-sm font-medium rounded-md bg-blue-500 text-white" onClick={() => handleEdit(employee.id)}>
                                                    <EditIcon fontSize="small" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                className="modal fixed inset-0 flex items-center justify-center"
                overlayClassName="modal-overlay fixed inset-0 flex items-center justify-center bg-black opacity-95 z-50"
                bodyOpenClassName="modal-open"
            >
                <div className="bg-white rounded-md shadow-md max-w-6xl w-full">
                    <h2 className="text-xl font-semibold p-4">Employee Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 p-4">
                        <Box width="100%" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="grid grid-cols-1 gap-4 justify-items-center">
                                <TextField
                                    label="Email"
                                    value={selectedEmployee.email || ""}
                                    name="email"
                                    onChange={handleInputChange}
                                    style={{ width: '600px', height: '40px' }}
                                />
                                <TextField
                                    label="Phone"
                                    value={selectedEmployee.phone || ""}
                                    name="phone"
                                    onChange={handleInputChange}
                                    style={{ width: '600px', height: '40px' }}
                                />
                                <TextField
                                    label="Full Name"
                                    value={selectedEmployee.full_name || ""}
                                    name="full_name"
                                    onChange={handleInputChange}
                                    style={{ width: '600px', height: '40px' }}
                                />
                                <TextField
                                    label="ID Card"
                                    value={selectedEmployee.id_card || ""}
                                    name="id_card"
                                    onChange={handleInputChange}
                                    style={{ width: '600px', height: '40px' }}
                                />
                                <TextField
                                    label="Address"
                                    value={selectedEmployee.address || ""}
                                    name="address"
                                    onChange={handleInputChange}
                                    style={{ width: '600px', height: '40px' }}
                                />
                                <TextField
                                    label="Username"
                                    value={selectedEmployee.username || ""}
                                    name="username"
                                    onChange={handleInputChange}
                                    style={{ width: '600px', height: '40px' }}
                                />
                                <TextField
                                    label="Password"
                                    value={selectedEmployee.password || ""}
                                    name="password"
                                    onChange={handleInputChange}
                                    type="password"
                                    style={{ width: '600px', height: '40px' }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {roles.map(role => (
                                        <FormControlLabel
                                            key={role}
                                            control={
                                                <Checkbox
                                                    checked={selectedEmployee.roles && selectedEmployee.roles.includes(role)}
                                                    onChange={(event) => {
                                                        const checked = event.target.checked;
                                                        let updatedRoles = [...(selectedEmployee.roles || [])];
                                                        if (checked) {
                                                            updatedRoles.push(role);
                                                        } else {
                                                            updatedRoles = updatedRoles.filter(r => r !== role);
                                                        }
                                                        setSelectedEmployee({
                                                            ...selectedEmployee,
                                                            roles: updatedRoles
                                                        });
                                                    }}
                                                />
                                            }
                                            label={role}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Box>
                        <div className="flex justify-end mt-4 p-4">
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                                Save
                            </button>
                            <button onClick={handleCloseModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default AdminHome;
