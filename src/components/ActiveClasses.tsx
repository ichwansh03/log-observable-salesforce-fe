import React, { useState, useEffect } from 'react';
import './MetadataViews.css';
import AddTraceModal from './AddTraceModal';
import type { ApexClass } from '../types';

const ActiveClasses: React.FC = () => {
  const [classes, setClasses] = useState<ApexClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<ApexClass | null>(null);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const url = searchTerm 
        ? `/api/sfdc/metadata/classes/db?name=${encodeURIComponent(searchTerm)}` 
        : '/api/sfdc/metadata/classes/db';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClasses();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (loading && classes.length === 0) return <div className="loading">Loading apex classes...</div>;

  return (
    <div className="page-container metadata-view-container">
      <div className="metadata-header">
        <h2>Active Apex Classes</h2>
      </div>

      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search classes by name..." 
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
              <th>API Version</th>
              <th>Last Modified</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.sfdcId}>
                <td className="entity-name">{cls.name}</td>
                <td>{cls.apiVersion}</td>
                <td>{new Date(cls.lastModifiedDate).toLocaleDateString()}</td>
                <td><span className="status-badge">{cls.status}</span></td>
                <td>
                  <button 
                    className="action-btn" 
                    onClick={() => setSelectedClass(cls)}
                  >
                    Trace
                  </button>
                </td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No classes found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedClass && (
        <AddTraceModal 
          entityId={selectedClass.sfdcId}
          entityName={selectedClass.name}
          entityType="ApexClass"
          onClose={() => setSelectedClass(null)}
        />
      )}
    </div>
  );
};

export default ActiveClasses;
