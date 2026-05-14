import React, { useState, useEffect } from 'react';
import './TraceFlagManager.css';

interface TraceFlag {
  id: string;
  tracedEntity: { name: string; attributes: { type: string } } | null;
  startDate: string;
  expirationDate: string;
  debugLevel: { developerName: string } | null;
}

const TraceFlagManager: React.FC = () => {
  const [traces, setTraces] = useState<TraceFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTraces = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sfdc/logs/trace-flags');
      if (!response.ok) throw new Error('Failed to fetch trace flags');
      const data = await response.json();
      setTraces(data);
    } catch (err) {
      setError('Failed to fetch active trace flags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraces();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this trace flag?')) return;
    
    try {
      const response = await fetch(`/api/sfdc/logs/trace-flags/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTraces(prev => prev.filter(t => t.id !== id));
      } else {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      alert('Failed to delete trace flag');
    }
  };

  if (loading) return <div className="loading">Loading active traces...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container trace-manager-container">
      <div className="manager-header">
        <h2>Active Trace Flags</h2>
        <button className="refresh-btn" onClick={fetchTraces}>Refresh</button>
      </div>

      <div className="table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              <th>Entity Name</th>
              <th>Type</th>
              <th>Debug Level</th>
              <th>Starts</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {traces.map((trace) => (
              <tr key={trace.id}>
                <td className="font-bold">{trace.tracedEntity?.name || 'Unknown'}</td>
                <td><span className="type-badge">{trace.tracedEntity?.attributes?.type || 'Unknown'}</span></td>
                <td>{trace.debugLevel?.developerName || 'Unknown'}</td>
                <td>{new Date(trace.startDate).toLocaleTimeString()}</td>
                <td>{new Date(trace.expirationDate).toLocaleTimeString()}</td>
                <td>
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => handleDelete(trace.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {traces.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                  No active trace flags found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TraceFlagManager;
