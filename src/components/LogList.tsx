import React, { useEffect, useState } from 'react';
import { type ApexLogDto } from '../types';

const LogList: React.FC = () => {
  const [logs, setLogs] = useState<ApexLogDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);

  const fetchLogs = async (currentPage: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sfdc/logs?page=${currentPage}&size=${size}`);
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data = await response.json();
      setLogs(data as ApexLogDto[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchLogs(page);
  }, [page, size]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(0, prev - 1));

  if (loading && logs.length === 0) return <div className="loading">Loading logs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="log-list-container">
      <h2>Apex Logs</h2>
      <div className="table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Class/Trigger</th>
              <th>Operation</th>
              <th>User</th>
              <th>Status</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.Id}>
                <td>{log.StartTime ? new Date(log.StartTime).toLocaleString() : 'N/A'}</td>
                <td>{log.apexClassName || 'N/A'}</td>
                <td>{log.Operation}</td>
                <td>{log.LogUser?.Name || 'N/A'}</td>
                <td>{log.Status}</td>
                <td>{log.LogLength ? `${(log.LogLength / 1024).toFixed(2)} KB` : '0 KB'}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6}>No logs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button className="pagination-btn" onClick={handlePrevPage} disabled={page === 0 || loading}>
          Previous
        </button>
        <span className="page-info">Page {page + 1}</span>
        <button className="pagination-btn" onClick={handleNextPage} disabled={logs.length < size || loading}>
          Next
        </button>
      </div>
    </div>
  );
};

export default LogList;
