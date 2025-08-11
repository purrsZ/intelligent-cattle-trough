import reducer, { clearSelected, setFilters, setSelectedIds, toggleSelect } from '../troughSlice';
import type { TroughState } from '../troughSlice';

describe('troughSlice reducers', () => {
  const initial: TroughState = {
    list: [],
    total: 0,
    selectedIds: [],
    filters: { page: 1, pageSize: 12 },
    loading: false,
    error: undefined,
  };

  test('setSelectedIds', () => {
    const state = reducer(initial, setSelectedIds(['a', 'b']));
    expect(state.selectedIds).toEqual(['a', 'b']);
  });

  test('toggleSelect', () => {
    let state = reducer(initial, toggleSelect('a'));
    expect(state.selectedIds).toEqual(['a']);
    state = reducer(state, toggleSelect('a'));
    expect(state.selectedIds).toEqual([]);
  });

  test('clearSelected', () => {
    const withSel = { ...initial, selectedIds: ['x'] };
    const state = reducer(withSel, clearSelected());
    expect(state.selectedIds).toEqual([]);
  });

  test('setFilters merges shallowly', () => {
    const state = reducer(initial, setFilters({ page: 3 }));
    expect(state.filters.page).toBe(3);
    expect(state.filters.pageSize).toBe(12);
  });
});


