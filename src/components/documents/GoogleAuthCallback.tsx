import React, { useEffect, useState } from 'react';
import { Result, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { checkGoogleConnection } from '../../redux/features/documentSlice';
import { useAppDispatch } from '../../redux/app/hooks';

const GoogleAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error) {
          setStatus('error');
          setErrorMessage(error);
          return;
        }

        // Verify the connection
        await dispatch(checkGoogleConnection()).unwrap();
        
        // Authentication successful
        setStatus('success');
        
        // Navigate back to the previous page after 2 seconds
        setTimeout(() => {
          const redirectPath = localStorage.getItem('googleAuthRedirect') || '/';
          navigate(redirectPath);
          localStorage.removeItem('googleAuthRedirect');
        }, 2000);
      } catch (error) {
        console.error('Error processing auth callback:', error);
        setStatus('error');
        setErrorMessage('Failed to complete Google authentication. Please try again.');
      }
    };

    processCallback();
  }, [dispatch, navigate]);

  if (status === 'loading') {
    return (
      <div className="auth-callback-container">
        <Spin size="large" tip="Processing Google authentication..." />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <Result
        status="error"
        title="Authentication Failed"
        subTitle={errorMessage || "There was a problem connecting to Google Drive. Please try again."}
        extra={[
          <button 
            key="back" 
            className="auth-back-button"
            onClick={() => {
              const redirectPath = localStorage.getItem('googleAuthRedirect') || '/';
              navigate(redirectPath);
              localStorage.removeItem('googleAuthRedirect');
            }}
          >
            Go Back
          </button>
        ]}
      />
    );
  }

  return (
    <Result
      status="success"
      title="Google Drive Connected Successfully"
      subTitle="You can now upload and manage documents through Google Drive."
    />
  );
};

export default GoogleAuthCallback; 