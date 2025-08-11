import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trough, TroughListResponse, TroughStatus } from '../types/trough';

export interface TroughFilters {
  keyword?: string;
  status?: TroughStatus;
  page: number;
  pageSize: number;
}

export interface TroughState {
  list: Trough[];
  total: number;
  selectedIds: string[];
  filters: TroughFilters;
  loading: boolean;
  error?: string;
}

const initialState: TroughState = {
  list: [],
  total: 0,
  selectedIds: [],
  filters: { page: 1, pageSize: 12 },
  loading: false,
  error: undefined,
};

/** 拉取饲槽列表 */
export const fetchTroughList = createAsyncThunk<
  TroughListResponse,
  Partial<TroughFilters> | void
>('trough/fetchList', async (maybeFilters) => {
  const params = { ...initialState.filters, ...(maybeFilters || {}) };
  const { fetchTroughList: apiFetchTroughList } = await import('../api/trough');
  return apiFetchTroughList(params);
});

/** 批量更新温度区间 */
export const updateTemperature = createAsyncThunk<
  { success: boolean },
  { troughIds: string[]; min: number; max: number }
>('trough/updateTemperature', async (payload) => {
  const { updateTroughTemperature: apiUpdateTemp } = await import('../api/trough');
  return apiUpdateTemp(payload);
});

const troughSlice = createSlice({
  name: 'trough',
  initialState,
  reducers: {
    setSelectedIds(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload;
    },
    clearSelected(state) {
      state.selectedIds = [];
    },
    toggleSelect(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id];
    },
    setFilters(state, action: PayloadAction<Partial<TroughFilters>>) {
      state.filters = { ...state.filters, ...action.payload } as TroughFilters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTroughList.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchTroughList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.total = action.payload.total;
      })
      .addCase(fetchTroughList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '加载失败';
      })
      .addCase(updateTemperature.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateTemperature.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTemperature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新失败';
      });
  },
});

export const { setSelectedIds, clearSelected, toggleSelect, setFilters } = troughSlice.actions;
export default troughSlice.reducer;


