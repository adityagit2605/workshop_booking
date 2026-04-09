import { useState, useEffect, useCallback } from 'react';
import { statistics } from '../api/client';

export function useStatistics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    selectedState: '',
    selectedType: '',
    sortBy: 'date',
    page: 1
  });

  const fetchStats = useCallback(async (params = '') => {
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
  }, []);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      selectedState: '',
      selectedType: '',
      sortBy: 'date',
      page: 1
    });
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.fromDate) params.set('from_date', filters.fromDate);
    if (filters.toDate) params.set('to_date', filters.toDate);
    if (filters.selectedState) params.set('state', filters.selectedState);
    if (filters.selectedType) params.set('workshop_type', filters.selectedType);
    if (filters.sortBy) params.set('sort', filters.sortBy);
    if (filters.page) params.set('page', filters.page);
    
    fetchStats(params.toString());
  }, [filters, fetchStats]);

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    fetchStats
  };
}
