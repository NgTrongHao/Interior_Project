import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import ApprovalList from '../Staff/ApprovalList.jsx';
import ManageProduct from './ManageProduct.jsx';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import ManagerProjectHD from './Manager/ManagerProjectHD';
const { Header, Content, Sider } = Layout;
import ManagerHome from '../Manager/ManagerHome.jsx';
import ManagerContent from './ManagerContent';

function Sidebar() {

    const [collapsed, setCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('MainContent');
    const colorBgContainer = '#fff'; // Define your color here
    const borderRadiusLG = '16px'; // Define your border radius here
    const userInfo = JSON.parse(localStorage.getItem('customer'));
    console.log(localStorage); // Set your user information here
    useEffect(() => {
        console.log("UserInfo: " + userInfo);
    }, [userInfo]);

    const handlePageChange = (key) => {
        setCurrentPage(key);
    };

    const ProposalList = () => {
        // Implement ProposalList component or route here
        return <div>Proposal List</div>;
    };




    return (
        <Layout className='h-screen '>
            <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: '#FFFFFF', color: '#000000' }} >
                <div className="demo-logo-vertical" />
                <Menu
                    theme="light"
                    mode="vertical"
                    defaultSelectedKeys={['1']}
                    onSelect={({ key }) => handlePageChange(key)} // Call function when selecting a page in the Sidebar
                >
                    <Menu.Item key="MainContent" icon={<UploadOutlined />}>
                        <span>Quản lí</span>
                    </Menu.Item>
                    <Menu.Item key="RequestList" icon={<UserOutlined />}>
                        <span>Chờ xác nhận</span>
                    </Menu.Item>
                    <Menu.Item key="ProposalList" icon={<VideoCameraOutlined />}>
                        <span> Dashboard</span>
                    </Menu.Item>
                    <Menu.Item key="ApprovalQuotationList" icon={<UploadOutlined />}>
                        <span>Đã phê duyệt</span>
                    </Menu.Item>
                    <Menu.Item key="ManageProduct">
                        <span>Quản lí sản phẩm</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout >
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
                <Content className='h-5/6 overflow-auto'
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 400,
                        height: "100%",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {currentPage === 'MainContent' ? (
                        <div>
                            {userInfo ? (
                                <div className='w-screen'>Xin chào, {userInfo.fullName}</div>
                            ) : (
                                <div>Loading...</div>
                            )}
                        </div>
                    ) : currentPage === 'RequestList' ? (
                        <ManagerProjectHD />
                    ) : currentPage === 'ProposalList' ? (
                        <ManagerContent />
                    ) : currentPage === 'ApprovalQuotationList' ? (
                        <ApprovalList />
                    ) : currentPage === 'ManageProduct' ? (
                        <ManageProduct />
                    ) : (
                        <div>Content of Proposal List or other pages...</div>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
}

export default Sidebar;
