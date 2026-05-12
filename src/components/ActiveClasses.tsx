import React, { useState, useEffect } from 'react';
import './MetadataViews.css';

interface ApexClass {
  id: string;
  name: string;
  apiVersion: string;
  status: string;
  lastModifiedDate: string;
}

const ActiveClasses: React.FC = () => {
  const [classes, setClasses] = useState<ApexClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockClasses: ApexClass[] = [
        { id: '01pxxx1', name: 'AccountService', apiVersion: '60.0', status: 'Active', lastModifiedDate: new Date().toISOString() },
        { id: '01pxxx2', name: 'LogService', apiVersion: '60.0', status: 'Active', lastModifiedDate: new Date().toISOString() },
        { id: '01pxxx3', name: 'TraceFlagController', apiVersion: '60.0', status: 'Active', lastModifiedDate: new Date().toISOString() },
        { id: '01pxxx4', name: 'MetadataUtils', apiVersion: '59.0', status: 'Active', lastModifiedDate: new Date().toISOString() },
      ];
      setClasses(mockClasses);
      setLoading(false);
    };
    fetchClasses();
  }, []);

  if (loading) return <div className="loading">Loading apex classes...</div>;

  return (
    <div className="page-container metadata-view-container">
      <div className="metadata-header">
        <h2>Active Apex Classes</h2>
      </div>

      <div className="table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>API Version</th>
              <th>Last Modified</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td className="entity-name">{cls.name}</td>
                <td>{cls.apiVersion}</td>
                <td>{new Date(cls.lastModifiedDate).toLocaleDateString()}</td>
                <td><span className="status-badge">{cls.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveClasses;
