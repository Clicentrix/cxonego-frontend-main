import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Card, Typography, Divider, Space, List, Alert, Button } from 'antd';
import { GoogleOutlined, CloudOutlined, FilePdfOutlined, FileExcelOutlined, FileWordOutlined, LoginOutlined } from '@ant-design/icons';
import GoogleDriveIntegration from '../../components/documents/GoogleDriveIntegration';
import { useNavigate } from 'react-router-dom';
import debugLog from '../../utils/debugLog';
const { Title, Paragraph, Text } = Typography;
const GoogleDrivePage = () => {
    const navigate = useNavigate();
    const [userAuthenticated, setUserAuthenticated] = useState(true);
    useEffect(() => {
        // Check if the user is logged in
        const userId = localStorage.getItem("userId");
        if (!userId) {
            debugLog('[Google Drive Page] User not authenticated', null, 'GoogleDrivePage');
            setUserAuthenticated(false);
        }
        else {
            setUserAuthenticated(true);
        }
    }, []);
    const handleLogin = () => {
        // Store the return path
        localStorage.setItem('returnAfterLogin', '/profile/google-drive');
        // Redirect to login page
        navigate('/login');
    };
    if (!userAuthenticated) {
        return (_jsx("div", { style: { maxWidth: '900px', margin: '0 auto', padding: '20px' }, children: _jsxs(Card, { children: [_jsxs(Title, { level: 2, children: [_jsx(GoogleOutlined, { style: { marginRight: 12, color: '#4285F4' } }), "Google Drive Integration"] }), _jsx(Divider, {}), _jsx(Alert, { message: "Authentication Required", description: "You need to be logged in to your account to use the Google Drive integration.", type: "warning", showIcon: true, style: { marginBottom: 20 } }), _jsx(Button, { type: "primary", icon: _jsx(LoginOutlined, {}), onClick: handleLogin, size: "large", children: "Log In Now" })] }) }));
    }
    return (_jsx("div", { style: { maxWidth: '900px', margin: '0 auto', padding: '20px' }, children: _jsxs(Card, { children: [_jsxs(Title, { level: 2, children: [_jsx(GoogleOutlined, { style: { marginRight: 12, color: '#4285F4' } }), "Google Drive Integration"] }), _jsx(Divider, {}), _jsxs(Space, { direction: "vertical", size: "large", style: { width: '100%' }, children: [_jsx(Paragraph, { children: "Connect your Google Drive account to securely store and access your business documents. This integration allows you to:" }), _jsx(List, { itemLayout: "horizontal", dataSource: [
                                {
                                    title: 'Securely upload documents',
                                    description: 'All files are stored securely in your Google Drive account',
                                    icon: _jsx(CloudOutlined, { style: { fontSize: 24, color: '#4285F4' } })
                                },
                                {
                                    title: 'Access documents anywhere',
                                    description: 'Access your uploaded documents from any device through Google Drive',
                                    icon: _jsx(FilePdfOutlined, { style: { fontSize: 24, color: '#DB4437' } })
                                },
                                {
                                    title: 'Organize business documents',
                                    description: 'Keep all your business documents organized in one place',
                                    icon: _jsx(FileWordOutlined, { style: { fontSize: 24, color: '#4285F4' } })
                                },
                                {
                                    title: 'Easily share with your team',
                                    description: 'Share documents with team members directly through Google Drive',
                                    icon: _jsx(FileExcelOutlined, { style: { fontSize: 24, color: '#0F9D58' } })
                                }
                            ], renderItem: item => (_jsx(List.Item, { children: _jsx(List.Item.Meta, { avatar: item.icon, title: item.title, description: item.description }) })) }), _jsx(Alert, { message: "Privacy Note", description: "This application will only have access to files it creates in your Google Drive. It cannot access any of your existing files unless you explicitly share them.", type: "info", showIcon: true }), _jsx(Divider, {}), _jsx(Title, { level: 3, children: "Connection Status" }), _jsx(GoogleDriveIntegration, { showTitle: false }), _jsx(Divider, {}), _jsx(Title, { level: 3, children: "Troubleshooting" }), _jsxs(Paragraph, { children: ["If you're experiencing issues with the Google Drive connection:", _jsxs("ul", { children: [_jsx("li", { children: "Try clicking the \"Check Connection Status\" button to verify your current connection." }), _jsx("li", { children: "Use the \"Reconnect with Google Drive\" button if your connection is having issues." }), _jsx("li", { children: "Make sure you're signed in to the correct Google account." }), _jsx("li", { children: "Check that you've granted the necessary permissions during the connection process." }), _jsx("li", { children: "Contact support if you continue to experience issues." })] })] })] })] }) }));
};
export default GoogleDrivePage;
