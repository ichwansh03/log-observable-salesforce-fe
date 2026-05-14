import React, { useState } from 'react';
import './AddTraceModal.css';

interface AddTraceModalProps {
  entityId: string;
  entityName: string;
  entityType: string;
  onClose: () => void;
}

const AddTraceModal: React.FC<AddTraceModalProps> = ({ entityId, entityName, entityType, onClose }) => {
  const [debugLevel, setDebugLevel] = useState('SFDC_DevConsole');
  const [durationMode, setDurationMode] = useState<'24h' | 'custom'>('24h');
  const [customDays, setCustomDays] = useState('0');
  const [customHours, setCustomHours] = useState('1');
  const [customMinutes, setCustomMinutes] = useState('0');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const response = await fetch('/api/sfdc/logs/trace-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tracedEntityId: entityId,
          debugLevelName: debugLevel,
          durationMinutes: totalMinutes,
        }),
      });

      if (response.ok) {
        setMessage({ text: `Successfully created trace flag for ${entityName}`, type: 'success' });
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error('Failed to create trace flag');
      }
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Failed to create trace flag', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-trace-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Setup Trace: {entityName}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="setup-form modal-form">
          <p className="entity-info">Target: <strong>{entityType}</strong></p>
          
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

          <div className="modal-actions">
            <button type="button" className="action-btn cancel-btn" onClick={onClose}>Cancel</button>
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Trace Flag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTraceModal;
