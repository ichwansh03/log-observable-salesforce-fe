import React, { useState, useEffect } from 'react';
import './MetadataViews.css';
import AddTraceModal from './AddTraceModal';

interface User {
  sfdcId: string;
  name: string;
  username: string;
  email: string;
  profileName: string;
}

const ActiveUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = searchTerm 
        ? `/api/sfdc/users/db?name=${encodeURIComponent(searchTerm)}` 
        : '/api/sfdc/users/db';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (loading && users.length === 0) return <div className="loading">Loading active users...</div>;

  return (
    <div className="page-container metadata-view-container">
      <div className="metadata-header">
        <h2>Active Users</h2>
      </div>

      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search users by name..." 
          className="metadata-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.sfdcId}>
                <td className="entity-name">{user.name}</td>
                <td className="api-name">{user.username}</td>
                <td>{user.email}</td>
                <td>{user.profileName}</td>
                <td><span className="status-badge">Active</span></td>
                <td>
                  <button 
                    className="action-btn" 
                    onClick={() => setSelectedUser(user)}
                  >
                    Trace
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <AddTraceModal 
          entityId={selectedUser.sfdcId}
          entityName={selectedUser.name}
          entityType="User"
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default ActiveUsers;
