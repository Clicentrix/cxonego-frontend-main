import React, { useEffect, useState } from 'react';
import { Card, Typography, Divider, Space, List, Alert, Button } from 'antd';
import { GoogleOutlined, CloudOutlined, FilePdfOutlined, FileExcelOutlined, FileWordOutlined, LoginOutlined } from '@ant-design/icons';
import GoogleDriveIntegration from '../../components/documents/GoogleDriveIntegration';
import { useNavigate } from 'react-router-dom';
import debugLog from '../../utils/debugLog';

const { Title, Paragraph, Text } = Typography;

const GoogleDrivePage: React.FC = () => {
  const navigate = useNavigate();
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    // Check if the user is logged in
    const userId = localStorage.getItem("userId");
    if (!userId) {
      debugLog('[Google Drive Page] User not authenticated', null, 'GoogleDrivePage');
      setUserAuthenticated(false);
    } else {
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
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <Card>
          <Title level={2}>
            <GoogleOutlined style={{ marginRight: 12, color: '#4285F4' }} />
            Google Drive Integration
          </Title>
          <Divider />
          
          <Alert
            message="Authentication Required"
            description="You need to be logged in to your account to use the Google Drive integration."
            type="warning"
            showIcon
            style={{ marginBottom: 20 }}
          />
          
          <Button 
            type="primary" 
            icon={<LoginOutlined />}
            onClick={handleLogin}
            size="large"
          >
            Log In Now
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <Card>
        <Title level={2}>
          <GoogleOutlined style={{ marginRight: 12, color: '#4285F4' }} />
          Google Drive Integration
        </Title>
        <Divider />
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Paragraph>
            Connect your Google Drive account to securely store and access your business documents.
            This integration allows you to:
          </Paragraph>
          
          <List
            itemLayout="horizontal"
            dataSource={[
              {
                title: 'Securely upload documents',
                description: 'All files are stored securely in your Google Drive account',
                icon: <CloudOutlined style={{ fontSize: 24, color: '#4285F4' }} />
              },
              {
                title: 'Access documents anywhere',
                description: 'Access your uploaded documents from any device through Google Drive',
                icon: <FilePdfOutlined style={{ fontSize: 24, color: '#DB4437' }} />
              },
              {
                title: 'Organize business documents',
                description: 'Keep all your business documents organized in one place',
                icon: <FileWordOutlined style={{ fontSize: 24, color: '#4285F4' }} />
              },
              {
                title: 'Easily share with your team',
                description: 'Share documents with team members directly through Google Drive',
                icon: <FileExcelOutlined style={{ fontSize: 24, color: '#0F9D58' }} />
              }
            ]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={item.icon}
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
          
          <Alert
            message="Privacy Note"
            description="This application will only have access to files it creates in your Google Drive. It cannot access any of your existing files unless you explicitly share them."
            type="info"
            showIcon
          />
          
          <Divider />
          
          <Title level={3}>Connection Status</Title>
          <GoogleDriveIntegration showTitle={false} />
          
          <Divider />
          
          <Title level={3}>Troubleshooting</Title>
          <Paragraph>
            If you're experiencing issues with the Google Drive connection:
            <ul>
              <li>Try clicking the "Check Connection Status" button to verify your current connection.</li>
              <li>Use the "Reconnect with Google Drive" button if your connection is having issues.</li>
              <li>Make sure you're signed in to the correct Google account.</li>
              <li>Check that you've granted the necessary permissions during the connection process.</li>
              <li>Contact support if you continue to experience issues.</li>
            </ul>
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
};

export default GoogleDrivePage; 