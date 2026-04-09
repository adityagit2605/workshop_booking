import React from 'react';
import Skeleton from '../components/Skeleton';

export default function StatsTable({ data, loading, error }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="stats-table-wrapper card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Coordinator Name</th>
            <th>Institute Name</th>
            <th>Instructor Name</th>
            <th>Workshop Name</th>
            <th>Workshop Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // Render 10 skeleton rows
            Array.from({ length: 10 }).map((_, idx) => (
              <tr key={`skeleton-${idx}`}>
                <td><Skeleton width="30px" /></td>
                <td><Skeleton width="150px" /></td>
                <td><Skeleton width="200px" /></td>
                <td><Skeleton width="120px" /></td>
                <td><Skeleton width="100px" borderRadius="100px" /></td>
                <td><Skeleton width="100px" /></td>
              </tr>
            ))
          ) : data?.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <div className="empty-state">
                  <span className="material-icons-round">event_busy</span>
                  <h3>No workshops found</h3>
                  <p>Try adjusting your filters or date range</p>
                </div>
              </td>
            </tr>
          ) : (
            data?.map((ws, idx) => (
              <tr key={ws.id} className="animate-fade-in" style={{ animationDelay: `${idx * 20}ms` }}>
                <td>
                  <span className="row-number">{idx + 1}</span>
                </td>
                <td className="font-semibold">{ws.coordinator_name}</td>
                <td>{ws.institute}</td>
                <td>{ws.instructor_name || '—'}</td>
                <td>
                  <span className="workshop-name-pill">{ws.workshop_type_name}</span>
                </td>
                <td className="text-muted">{formatDate(ws.date)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
