import React, { useState, useEffect } from 'react';
import AutocompleteInput from './AutocompleteInput';
import './TraceFlagSetup.css';

const TraceFlagSetup: React.FC = () => {
  const [metadata, setMetadata] = useState<{ id: string; name: string; type: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; type?: string } | null>(null);
  const [debugLevel, setDebugLevel] = useState('SFDC_DevConsole');
  const [durationMode, setDurationMode] = useState<'24h' | 'custom'>('24h');
  const [customDays, setCustomDays] = useState('0');
  const [customHours, setCustomHours] = useState('1');
  const [customMinutes, setCustomMinutes] = useState('0');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // ... rest of metadata fetching

    // In a real app, you would fetch this from /api/sfdc/metadata
    const fetchMetadata = async () => {
      try {
        // Simulated delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = [
          { id: '005xxx1', name: 'Ichwan Sholihin', type: 'User' },
          { id: '005xxx2', name: 'Admin User', type: 'User' },
          { id: '01pxxx1', name: 'AccountTrigger', type: 'ApexTrigger' },
          { id: '01pxxx2', name: 'ContactTrigger', type: 'ApexTrigger' },
          { id: '01pxxx3', name: 'AccountService', type: 'ApexClass' },
          { id: '01pxxx4', name: 'LogService', type: 'ApexClass' },
        ];
        setMetadata(mockData);
      } catch (err) {
        console.error('Failed to fetch metadata', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) {
      setMessage({ text: 'Please select a User, Class, or Trigger', type: 'error' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    let totalMinutes = 1440; // Default 24h
    if (durationMode === 'custom') {
      totalMinutes = (parseInt(customDays) * 1440) + (parseInt(customHours) * 60) + parseInt(customMinutes);
    }

    if (totalMinutes <= 0) {
      setMessage({ text: 'Duration must be greater than 0 minutes', type: 'error' });
      setSubmitting(false);
      return;
    }

    try {
      // API call to create trace flag
      const response = await fetch('/api/sfdc/logs/trace-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tracedEntityId: selectedItem.id,
          debugLevelName: debugLevel,
          durationMinutes: totalMinutes,
        }),
      });

      if (response.ok) {
        setMessage({ text: `Successfully created trace flag for ${selectedItem.name}`, type: 'success' });
        setSelectedItem(null);
      } else {
        throw new Error('Failed to create trace flag');
      }
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Failed to create trace flag', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading metadata...</div>;

  return (
    <div className="page-container setup-trace-container">
      <div className="setup-card">
        <h2>Setup New Trace Flag</h2>
        <p className="subtitle">Configure automated logging for specific Salesforce entities.</p>
        
        <form onSubmit={handleSubmit} className="setup-form">
          <AutocompleteInput 
            label="Search Entity (User, Class, or Trigger)"
            placeholder="Start typing name..."
            items={metadata}
            onSelect={setSelectedItem}
          />

          <div className="form-row">
            <div className="form-group">
              <label>Debug Level</label>
              <select 
                value={debugLevel} 
                onChange={(e) => setDebugLevel(e.target.value)}
                className="form-select"
              >
                <option value="SFDC_DevConsole">SFDC_DevConsole</option>
                <option value="SFDC_LogLevel">SFDC_LogLevel</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div className="form-group">
              <label>Duration Mode</label>
              <div className="mode-toggle">
                <button 
                  type="button"
                  className={`toggle-btn ${durationMode === '24h' ? 'active' : ''}`}
                  onClick={() => setDurationMode('24h')}
                >
                  24 Hours
                </button>
                <button 
                  type="button"
                  className={`toggle-btn ${durationMode === 'custom' ? 'active' : ''}`}
                  onClick={() => setDurationMode('custom')}
                >
                  Custom
                </button>
              </div>
            </div>
          </div>

          {durationMode === 'custom' && (
            <div className="form-row custom-duration-row">
              <div className="form-group mini">
                <label>Days</label>
                <input 
                  type="number" 
                  value={customDays} 
                  onChange={(e) => setCustomDays(e.target.value)}
                  min="0"
                  className="form-input"
                />
              </div>
              <div className="form-group mini">
                <label>Hours</label>
                <input 
                  type="number" 
                  value={customHours} 
                  onChange={(e) => setCustomHours(e.target.value)}
                  min="0"
                  max="23"
                  className="form-input"
                />
              </div>
              <div className="form-group mini">
                <label>Mins</label>
                <input 
                  type="number" 
                  value={customMinutes} 
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  min="0"
                  max="59"
                  className="form-input"
                />
              </div>
            </div>
          )}

          {message && (
            <div className={`form-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={submitting || !selectedItem}
          >
            {submitting ? 'Creating...' : 'Create Trace Flag'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TraceFlagSetup;
