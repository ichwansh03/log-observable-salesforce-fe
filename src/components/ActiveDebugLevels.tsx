import React, { useState, useEffect } from 'react';
import './MetadataViews.css';
import type { DebugLevel } from '../types';

const ActiveDebugLevels: React.FC = () => {
  const [levels, setLevels] = useState<DebugLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLevels = async () => {
    setLoading(true);
    try {
      const url = searchTerm 
        ? `/api/sfdc/metadata/debug-levels/db?name=${encodeURIComponent(searchTerm)}` 
        : '/api/sfdc/metadata/debug-levels/db';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch debug levels');
      const data = await response.json();
      setLevels(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLevels();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (loading && levels.length === 0) return <div className="loading">Loading debug levels...</div>;

  return (
    <div className="page-container metadata-view-container">
      <div className="metadata-header">
        <h2>Debug Levels</h2>
      </div>

      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search debug levels..." 
          className="metadata-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              <th>Developer Name</th>
              <th>Master Label</th>
              <th>Apex Code</th>
              <th>Profiling</th>
              <th>Database</th>
              <th>System</th>
              <th>Workflow</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level) => (
              <tr key={level.sfdcId}>
                <td className="entity-name">{level.developerName}</td>
                <td>{level.masterLabel}</td>
                <td><span className="status-badge">{level.apexCode}</span></td>
                <td>{level.apexProfiling}</td>
                <td>{level.database}</td>
                <td>{level.system}</td>
                <td>{level.workflow}</td>
              </tr>
            ))}
            {levels.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>No debug levels found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveDebugLevels;
