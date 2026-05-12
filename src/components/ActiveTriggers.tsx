import React, { useState, useEffect } from 'react';
import './MetadataViews.css';

interface ApexTrigger {
  id: string;
  name: string;
  sobject: string;
  status: string;
  lastModifiedDate: string;
}

const ActiveTriggers: React.FC = () => {
  const [triggers, setTriggers] = useState<ApexTrigger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTriggers = async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockTriggers: ApexTrigger[] = [
        { id: '01qxxx1', name: 'AccountTrigger', sobject: 'Account', status: 'Active', lastModifiedDate: new Date().toISOString() },
        { id: '01qxxx2', name: 'ContactTrigger', sobject: 'Contact', status: 'Active', lastModifiedDate: new Date().toISOString() },
        { id: '01qxxx3', name: 'OpportunityTrigger', sobject: 'Opportunity', status: 'Active', lastModifiedDate: new Date().toISOString() },
        { id: '01qxxx4', name: 'CaseTrigger', sobject: 'Case', status: 'Active', lastModifiedDate: new Date().toISOString() },
      ];
      setTriggers(mockTriggers);
      setLoading(false);
    };
    fetchTriggers();
  }, []);

  if (loading) return <div className="loading">Loading apex triggers...</div>;

  return (
    <div className="page-container metadata-view-container">
      <div className="metadata-header">
        <h2>Active Apex Triggers</h2>
      </div>

      <div className="table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SObject</th>
              <th>Last Modified</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {triggers.map((trigger) => (
              <tr key={trigger.id}>
                <td className="entity-name">{trigger.name}</td>
                <td className="api-name">{trigger.sobject}</td>
                <td>{new Date(trigger.lastModifiedDate).toLocaleDateString()}</td>
                <td><span className="status-badge">{trigger.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveTriggers;
