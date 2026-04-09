import { useState } from 'react';
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
import { useStatistics } from './useStatistics';
import FilterSidebar from './FilterSidebar';
import StatsTable from './StatsTable';
import Skeleton from '../components/Skeleton';
import './WorkshopStatistics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function WorkshopStatistics() {
  const { 
    data, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    clearFilters 
  } = useStatistics();

  const [chartModal, setChartModal] = useState(null);

  const handleDownload = () => {
    const params = new URLSearchParams();
    if (filters.fromDate) params.set('from_date', filters.fromDate);
    if (filters.toDate) params.set('to_date', filters.toDate);
    if (filters.selectedState) params.set('state', filters.selectedState);
    if (filters.selectedType) params.set('workshop_type', filters.selectedType);
    if (filters.sortBy) params.set('sort', filters.sortBy);
    params.set('download', 'download');
    window.open(`/api/statistics/public?${params.toString()}`, '_blank');
  };

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
        ticks: { font: { family: 'Inter', size: 11 }, maxRotation: 45 },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { font: { family: 'Inter', size: 11 }, stepSize: 1 },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
    },
  };

  const getChartConfig = (labels, chartData, label, color) => ({
    labels,
    datasets: [{
      label,
      data: chartData,
      backgroundColor: color === 'state' ? 'rgba(99, 102, 241, 0.7)' : 'rgba(20, 184, 166, 0.7)',
      borderColor: color === 'state' ? 'rgb(99, 102, 241)' : 'rgb(20, 184, 166)',
      borderWidth: 2,
      borderRadius: 6,
    }],
  });

  return (
    <>
      <SEO 
        title="Statistics & Analytics | FOSSEE Workshop Portal"
        description="Explore detailed analytics and statistics of FOSSEE workshops."
      />
      
      <div className="stats-page page-container-fluid animate-fade-in">
        <div className="stats-layout">
          <FilterSidebar 
            filters={filters}
            updateFilters={updateFilters}
            clearFilters={clearFilters}
            filterOptions={data?.filter_options}
            onDownload={handleDownload}
          />

          <main className="stats-main">
            <div className="stats-action-bar">
              <div className="stats-pagination-top">
                {loading ? <Skeleton width="200px" height="36px" /> : renderPagination(data, (p) => updateFilters({ page: p }))}
              </div>
              <div className="stats-chart-buttons">
                <button className="btn btn-teal" onClick={() => setChartModal('state')} disabled={loading}>
                  <span className="material-icons-round" style={{ fontSize: 18 }}>bar_chart</span>
                  State chart
                </button>
                <button className="btn btn-teal" onClick={() => setChartModal('type')} disabled={loading}>
                  <span className="material-icons-round" style={{ fontSize: 18 }}>bar_chart</span>
                  Workshops chart
                </button>
              </div>
            </div>

            <StatsTable 
              data={data?.workshops}
              loading={loading}
              error={error}
            />

            {!loading && data && (
              <div className="stats-pagination-bottom">
                {renderPagination(data, (p) => updateFilters({ page: p }))}
              </div>
            )}
          </main>
        </div>

        {chartModal && data?.chart_data && (
          <div className="modal-overlay" onClick={() => setChartModal(null)}>
            <div className="modal-content chart-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{chartModal === 'state' ? 'State Wise Workshops' : 'Type Wise Workshops'}</h3>
                <button className="modal-close-btn" onClick={() => setChartModal(null)}>
                  <span className="material-icons-round">close</span>
                </button>
              </div>
              <div className="modal-body chart-body" style={{ height: '400px' }}>
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
  if (!data || data.num_pages <= 1) return null;
  const pages = [];
  const current = data.current_page;
  const total = data.num_pages;
  for (let i = Math.max(1, current - 4); i <= Math.min(total, current + 4); i++) pages.push(i);

  return (
    <div className="pagination">
      {data.has_previous && (
        <button className="page-btn" onClick={() => onPageChange(current - 1)}>
          <span className="material-icons-round" style={{ fontSize: 16 }}>chevron_left</span>
        </button>
      )}
      {pages.map((p) => (
        <button key={p} className={`page-btn ${p === current ? 'active' : ''}`} onClick={() => onPageChange(p)}>
          {p}
        </button>
      ))}
      {data.has_next && (
        <button className="page-btn" onClick={() => onPageChange(current + 1)}>
          <span className="material-icons-round" style={{ fontSize: 16 }}>chevron_right</span>
        </button>
      )}
    </div>
  );
}
