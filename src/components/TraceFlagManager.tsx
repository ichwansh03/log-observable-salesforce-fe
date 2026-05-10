import React, { useState, useEffect } from 'react';
import './TraceFlagManager.css';

interface TraceFlag {
  id: string;
  tracedEntityName: string;
  tracedEntityType: string;
  startDate: string;
  expirationDate: string;
  debugLevelName: string;
}

const TraceFlagManager: React.FC = () => {
  const [traces, setTraces] = useState<TraceFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTraces = async () => {
    setLoading(true);
    try {
      // Mock API call
      // In a real app, you would fetch this from /api/sfdc/trace-flags
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockTraces: TraceFlag[] = [
        {
          id: '1',
          tracedEntityName: 'Ichwan Sholihin',
          tracedEntityType: 'User',
          startDate: new Date().toISOString(),
          expirationDate: new Date(Date.now() + 30 * 60000).toISOString(),
          debugLevelName: 'SFDC_DevConsole'
        },
        {
          id: '2',
          tracedEntityName: 'AccountTrigger',
          tracedEntityType: 'ApexTrigger',
          startDate: new Date().toISOString(),
          expirationDate: new Date(Date.now() + 60 * 60000).toISOString(),
          debugLevelName: 'SFDC_LogLevel'
        }
      ];
      setTraces(mockTraces);
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
      // Mock API call
      await fetch(`/api/sfdc/trace-flags/${id}`, { method: 'DELETE' });
      setTraces(prev => prev.filter(t => t.id !== id));
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
                <td className="font-bold">{trace.tracedEntityName}</td>
                <td><span className="type-badge">{trace.tracedEntityType}</span></td>
                <td>{trace.debugLevelName}</td>
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
