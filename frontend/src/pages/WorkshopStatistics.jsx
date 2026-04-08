import { useState, useEffect, useRef } from 'react';
import { statistics } from '../api/client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import SEO from '../components/SEO';
import './WorkshopStatistics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function WorkshopStatistics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Chart modal
  const [chartModal, setChartModal] = useState(null); // 'state' | 'type' | null

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats(params = '') {
    setLoading(true);
    setError('');
    try {
      const result = await statistics.public(params);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }

  function handleFilter(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fromDate) params.set('from_date', fromDate);
    if (toDate) params.set('to_date', toDate);
    if (selectedState) params.set('state', selectedState);
    if (selectedType) params.set('workshop_type', selectedType);
    if (sortBy) params.set('sort', sortBy);
    fetchStats(params.toString());
  }

  function handleClear() {
    setFromDate('');
    setToDate('');
    setSelectedState('');
    setSelectedType('');
    setSortBy('date');
    fetchStats();
  }

  function handlePageChange(page) {
    const params = new URLSearchParams();
    if (fromDate) params.set('from_date', fromDate);
    if (toDate) params.set('to_date', toDate);
    if (selectedState) params.set('state', selectedState);
    if (selectedType) params.set('workshop_type', selectedType);
    if (sortBy) params.set('sort', sortBy);
    params.set('page', page);
    fetchStats(params.toString());
  }

  function handleDownload() {
    const params = new URLSearchParams();
    if (fromDate) params.set('from_date', fromDate);
    if (toDate) params.set('to_date', toDate);
    if (selectedState) params.set('state', selectedState);
    if (selectedType) params.set('workshop_type', selectedType);
    if (sortBy) params.set('sort', sortBy);
    params.set('download', 'download');
    window.open(`/statistics/public?${params.toString()}`, '_blank');
  }

  function getChartConfig(labels, chartData, label, color) {
    return {
      labels,
      datasets: [{
        label,
        data: chartData,
        backgroundColor: color === 'state'
          ? 'rgba(99, 102, 241, 0.7)'
          : 'rgba(20, 184, 166, 0.7)',
        borderColor: color === 'state'
          ? 'rgb(99, 102, 241)'
          : 'rgb(20, 184, 166)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }],
    };
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Inter', size: 13, weight: '600' },
          padding: 20,
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: { family: 'Inter', size: 11 },
          maxRotation: 45,
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { family: 'Inter', size: 11 },
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
    },
  };

  return (
    <>
      <SEO 
        title="Statistics & Analytics | FOSSEE Workshop Portal"
        description="Explore detailed analytics and statistics of FOSSEE workshops conducted across different states and institutions in India."
        keywords="FOSSEE statistics, workshop analytics, IIT Bombay training data, state wise workshops"
      />
      <div className="stats-page page-container-fluid animate-fade-in">
        <div className="stats-layout">
        {/* ── Sidebar Filters ── */}
        <aside className="stats-sidebar">
          <div className="filter-card card">
            <div className="filter-header">
              <div className="filter-title-row">
                <h3 className="filter-title">
                  <span className="material-icons-round">filter_list</span>
                  Filters
                </h3>
                <button
                  onClick={handleClear}
                  className="btn btn-secondary btn-sm"
                  id="filter-clear"
                >
                  <span className="material-icons-round" style={{fontSize:16}}>close</span>
                  Clear
                </button>
              </div>
            </div>

            <form onSubmit={handleFilter} className="filter-body" id="filter-form">
              <div className="form-group">
                <label className="form-label">From date:</label>
                <input
                  type="date"
                  className="form-input"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  id="filter-from-date"
                />
              </div>

              <div className="form-group">
                <label className="form-label">To date:</label>
                <input
                  type="date"
                  className="form-input"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  id="filter-to-date"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Workshop:</label>
                <select
                  className="form-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  id="filter-workshop-type"
                >
                  <option value="">---------</option>
                  {data?.filter_options?.workshop_types?.map((wt) => (
                    <option key={wt.id} value={wt.id}>{wt.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">State:</label>
                <select
                  className="form-select"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  id="filter-state"
                >
                  <option value="">---------</option>
                  {data?.filter_options?.states?.map((s) => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sort by:</label>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  id="filter-sort"
                >
                  <option value="date">Oldest</option>
                  <option value="-date">Latest</option>
                </select>
              </div>

              <div className="filter-actions">
                <button type="submit" className="btn btn-success" id="filter-view">
                  <span className="material-icons-round" style={{fontSize:18}}>visibility</span>
                  View
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn btn-teal"
                  id="filter-download"
                >
                  <span className="material-icons-round" style={{fontSize:18}}>download</span>
                  Download
                </button>
              </div>
            </form>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="stats-main">
          {/* Action Bar */}
          <div className="stats-action-bar">
            <div className="stats-pagination-top">
              {data && renderPagination(data, handlePageChange)}
            </div>
            <div className="stats-chart-buttons">
              <button
                className="btn btn-teal"
                onClick={() => setChartModal('state')}
                id="state-chart-btn"
              >
                <span className="material-icons-round" style={{fontSize:18}}>bar_chart</span>
                State chart
              </button>
              <button
                className="btn btn-teal"
                onClick={() => setChartModal('type')}
                id="type-chart-btn"
              >
                <span className="material-icons-round" style={{fontSize:18}}>bar_chart</span>
                Workshops chart
              </button>
            </div>
          </div>

          {/* Data Table */}
          {loading ? (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Loading workshop data...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="stats-table-wrapper card">
              <table className="data-table" id="stats-table">
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
                  {data?.workshops?.length === 0 ? (
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
                    data?.workshops?.map((ws, idx) => (
                      <tr key={ws.id} className="animate-fade-in" style={{animationDelay: `${idx * 30}ms`}}>
                        <td>
                          <span className="row-number">{(data.start_index || 1) + idx}</span>
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
          )}

          {/* Bottom Pagination */}
          {data && (
            <div className="stats-pagination-bottom">
              {renderPagination(data, handlePageChange)}
            </div>
          )}
        </main>
      </div>

      {/* ── Chart Modal ── */}
      {chartModal && data?.chart_data && (
        <div className="modal-overlay" onClick={() => setChartModal(null)}>
          <div
            className="modal-content chart-modal"
            onClick={(e) => e.stopPropagation()}
            id="chart-modal"
          >
            <div className="modal-header">
              <h3>
                {chartModal === 'state' ? 'State Wise Workshops' : 'Type Wise Workshops'}
              </h3>
              <button
                className="modal-close-btn"
                onClick={() => setChartModal(null)}
                id="chart-modal-close"
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="modal-body chart-body">
              <Bar
                data={getChartConfig(
                  chartModal === 'state' ? data.chart_data.states : data.chart_data.types,
                  chartModal === 'state' ? data.chart_data.state_counts : data.chart_data.type_counts,
                  chartModal === 'state' ? 'State wise workshops' : 'Type wise workshops',
                  chartModal
                )}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

function renderPagination(data, onPageChange) {
  if (data.num_pages <= 1) return null;
  const pages = [];
  const current = data.current_page;
  const total = data.num_pages;

  for (let i = Math.max(1, current - 4); i <= Math.min(total, current + 4); i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      {data.has_previous && (
        <button className="page-btn" onClick={() => onPageChange(1)}>
          <span className="material-icons-round" style={{fontSize:16}}>first_page</span>
        </button>
      )}
      {pages.map((p) => (
        <button
          key={p}
          className={`page-btn ${p === current ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      {data.has_next && (
        <button className="page-btn" onClick={() => onPageChange(total)}>
          <span className="material-icons-round" style={{fontSize:16}}>last_page</span>
        </button>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
