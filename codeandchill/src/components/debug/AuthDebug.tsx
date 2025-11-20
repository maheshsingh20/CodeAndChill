import React from 'react';
import { useUser } from '@/contexts/UserContext';

export const AuthDebug: React.FC = () => {
  const { user, loading, error } = useUser();
  
  const authToken = localStorage.getItem('authToken');
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      background: 'black', 
      color: 'white', 
      padding: '10px', 
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Auth Debug</h4>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      <div>Error: {error || 'None'}</div>
      <div>User: {user ? user.name : 'None'}</div>
      <div>Token: {authToken ? 'Present' : 'Missing'}</div>
      <div>IsAuth: {isAuthenticated}</div>
    </div>
  );
};