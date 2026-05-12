import React, { useState, useEffect } from 'react';
import './MetadataViews.css';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

const ActiveUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockUsers: User[] = [
        { id: '005xxx1', name: 'Ichwan Sholihin', username: 'ichwan@sfdc.demo', email: 'ichwan@example.com', role: 'System Administrator' },
        { id: '005xxx2', name: 'Admin User', username: 'admin@sfdc.demo', email: 'admin@example.com', role: 'System Administrator' },
        { id: '005xxx3', name: 'Standard User', username: 'user@sfdc.demo', email: 'user@example.com', role: 'Standard User' },
      ];
      setUsers(mockUsers);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="loading">Loading active users...</div>;

  return (
    <div className="page-container metadata-view-container">
      <div className="metadata-header">
        <h2>Active Users</h2>
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
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="entity-name">{user.name}</td>
                <td className="api-name">{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td><span className="status-badge">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveUsers;
