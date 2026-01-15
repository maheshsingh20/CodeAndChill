import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/constants';

export const ApiTest: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>('Testing...');
  const [learningPathsStatus, setLearningPathsStatus] = useState<string>('Testing...');

  useEffect(() => {
    testApi();
  }, []);

  const testApi = async () => {
    // Log environment variables
    console.log('🔍 Environment check:');
    console.log('🔍 import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('🔍 API_BASE_URL:', API_BASE_URL);
    console.log('🔍 Current location:', window.location.href);

    // Test basic API connection
    try {
      console.log('🔍 Testing API connection...');

      const healthUrl = `${API_BASE_URL}/health`;
      console.log('🏥 Health check URL:', healthUrl);

      const healthResponse = await fetch(healthUrl);
      console.log('🏥 Health check response:', healthResponse);

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('🏥 Health data:', healthData);
        setApiStatus(`✅ API Connected: ${healthData.message}`);
      } else {
        setApiStatus(`❌ API Health Check Failed: ${healthResponse.status}`);
      }
    } catch (error) {
      console.error('❌ API Connection Error:', error);
      setApiStatus(`❌ API Connection Error: ${error}`);
    }

    // Test learning paths endpoint
    try {
      console.log('🔍 Testing learning paths endpoint...');
      const pathsUrl = `${API_BASE_URL}/learning-paths`;
      console.log('📚 Learning paths URL:', pathsUrl);

      const pathsResponse = await fetch(pathsUrl);
      console.log('📚 Learning paths response:', pathsResponse);

      if (pathsResponse.ok) {
        const pathsData = await pathsResponse.json();
        console.log('📚 Learning paths data:', pathsData);
        setLearningPathsStatus(`✅ Learning Paths: Found ${pathsData.paths?.length || 0} paths`);
      } else {
        const errorText = await pathsResponse.text();
        console.error('❌ Learning paths error:', errorText);
        setLearningPathsStatus(`❌ Learning Paths Failed: ${pathsResponse.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Learning Paths Error:', error);
      setLearningPathsStatus(`❌ Learning Paths Error: ${error}`);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 max-w-md">
      <h3 className="font-bold mb-2">API Test Results</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>API Base URL:</strong> {API_BASE_URL}
        </div>
        <div>
          <strong>VITE_API_URL:</strong> {import.meta.env.VITE_API_URL}
        </div>
        <div>
          <strong>Health Check:</strong> {apiStatus}
        </div>
        <div>
          <strong>Learning Paths:</strong> {learningPathsStatus}
        </div>
      </div>
    </div>
  );
};