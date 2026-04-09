import React from 'react';

export default function FilterSidebar({ filters, updateFilters, clearFilters, filterOptions, onDownload }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic is handled by useStatistics through filters state
  };

  return (
    <aside className="stats-sidebar">
      <div className="filter-card card">
        <div className="filter-header">
          <div className="filter-title-row">
            <h3 className="filter-title">
              <span className="material-icons-round">filter_list</span>
              Filters
            </h3>
            <button onClick={clearFilters} className="btn btn-secondary btn-sm">
              <span className="material-icons-round" style={{ fontSize: 16 }}>close</span>
              Clear
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="filter-body">
          <div className="form-group">
            <label className="form-label">From date:</label>
            <input
              type="date"
              className="form-input"
              value={filters.fromDate}
              onChange={(e) => updateFilters({ fromDate: e.target.value, page: 1 })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">To date:</label>
            <input
              type="date"
              className="form-input"
              value={filters.toDate}
              onChange={(e) => updateFilters({ toDate: e.target.value, page: 1 })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Workshop:</label>
            <select
              className="form-select"
              value={filters.selectedType}
              onChange={(e) => updateFilters({ selectedType: e.target.value, page: 1 })}
            >
              <option value="">---------</option>
              {filterOptions?.workshop_types?.map((wt) => (
                <option key={wt.id} value={wt.id}>{wt.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">State:</label>
            <select
              className="form-select"
              value={filters.selectedState}
              onChange={(e) => updateFilters({ selectedState: e.target.value, page: 1 })}
            >
              <option value="">---------</option>
              {filterOptions?.states?.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Sort by:</label>
            <select
              className="form-select"
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value, page: 1 })}
            >
              <option value="date">Oldest</option>
              <option value="-date">Latest</option>
            </select>
          </div>

          <div className="filter-actions">
            <button type="button" onClick={onDownload} className="btn btn-teal">
              <span className="material-icons-round" style={{ fontSize: 18 }}>download</span>
              Download
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}
