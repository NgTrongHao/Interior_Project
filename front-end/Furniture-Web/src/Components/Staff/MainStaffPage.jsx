import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import RequestList from './RequestList'; // Import component RequestList
import ProposalList from './ProposalList';
import ApprovalList from './ApprovalList';
import RequestDetail from '../Manager/Manager/RequestDetail';

const { Header, Sider, Content } = Layout;

const MainStaffPage = () => {
    const [showRequestDetails, setShowRequestDetails] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('MainContent'); // State để lưu trang hiện tại

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();


    useEffect(() => {

    }, [RequestDetail])

    useEffect(() => {

        // Fetch API và lưu thông tin người dùng vào state khi component mount
        const fetchUserProfile = async () => {
            try {
                const token = Cookies.get('token');
                const response = await fetch('http://localhost:8080/api/v1/user/auth/userProfile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                } else {
                    console.error('Failed to fetch user profile');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handlePageChange = (pageName) => {
        setCurrentPage(pageName);
    };

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: '#FFFFFF', color: '#000000' }}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="light"
                    mode="vertical"
                    defaultSelectedKeys={['1']}
                    onSelect={({ key }) => handlePageChange(key)} // Gọi hàm khi lựa chọn trang trong Sidebar
                >
                    <Menu.Item key="MainContent" icon={<UploadOutlined />}>
                        <span>Home</span>
                    </Menu.Item>
                    <Menu.Item key="RequestList" icon={<UserOutlined />}>
                        <span>Đợi xác nhận</span>
                    </Menu.Item>
                    <Menu.Item key="ProposalList" icon={<VideoCameraOutlined />}>
                        <span>Chờ đề xuất</span>
                    </Menu.Item>
                    <Menu.Item key="ApprovalQuotationList" icon={<UploadOutlined />}>
                        <span>Đã phê duyệt</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 1000,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {currentPage === 'MainContent' ? (
                        <div>
                            {userInfo ? (
                                <div>Xin chào, {userInfo.fullName}</div>
                            ) : (
                                <div>Loading...</div>
                            )}
                        </div>
                    ) : currentPage === 'RequestList' ? (
                        <RequestList /> // Pass function to change page to RequestDetails
                    ) : currentPage === 'ProposalList' ? (
                        <ProposalList />
                    ) : currentPage === 'ApprovalQuotationList' ? (
                        <ApprovalList />
                    ) : (
                        <div>Trang không tồn tại...</div>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainStaffPage;
