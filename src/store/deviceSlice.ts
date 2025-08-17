/**
 * 设备状态管理切片
 * 使用新的API接口和数据结构
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  queryDevices,
  updateDeviceConfig,
  getDeviceGroupList,
  isApiSuccess,
} from '../api';
import type {
  DeviceItem,
  DeviceGroupItem,
  QueryDevicesRequest,
  AlarmType,
} from '../types/trough';
import { PAGINATION } from '../types/enums';

/**
 * 设备查询过滤器
 */
export interface DeviceFilters {
  deviceName?: string;
  alarmType?: AlarmType;
  groupId?: number;
  pageNum: number;
  pageSize: number;
}

/**
 * 设备状态
 */
export interface DeviceState {
  /** 设备列表 */
  devices: DeviceItem[];
  /** 设备组列表 */
  deviceGroups: DeviceGroupItem[];
  /** 总设备数 */
  total: number;
  /** 已选择的设备ID */
  selectedDeviceIds: number[];
  /** 查询过滤器 */
  filters: DeviceFilters;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error?: string;
}

const initialState: DeviceState = {
  devices: [],
  deviceGroups: [],
  total: 0,
  selectedDeviceIds: [],
  filters: {
    pageNum: PAGINATION.DEFAULT_PAGE_NUM,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  },
  loading: false,
  error: undefined,
};

// ============ 异步Thunk Actions ============

/**
 * 获取设备列表
 */
export const fetchDevices = createAsyncThunk<
  { devices: DeviceItem[]; total: number; totalPage: number },
  Partial<DeviceFilters> | void
>('device/fetchDevices', async (filterParams = {}) => {
  const params: QueryDevicesRequest = {
    pageNum: PAGINATION.DEFAULT_PAGE_NUM,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    ...filterParams,
  };

  const response = await queryDevices(params);
  
  console.log('🔍 fetchDevices API响应:', response);
  
  // 检查HTTP状态码和业务状态码
  if (!isApiSuccess(response.code)) {
    throw new Error(response.msg || '获取设备列表失败');
  }

  // 确保数据存在
  if (!response.data || !response.data.pageData) {
    throw new Error('响应数据格式错误');
  }

  const result = {
    devices: response.data.pageData,
    total: response.data.total,
    totalPage: response.data.totalPage,
  };
  
  console.log('📦 fetchDevices 返回数据:', result);
  
  return result;
});

/**
 * 获取设备组列表
 */
export const fetchDeviceGroups = createAsyncThunk<
  DeviceGroupItem[],
  void
>('device/fetchDeviceGroups', async () => {
  const response = await getDeviceGroupList({
    pageNum: PAGINATION.DEFAULT_PAGE_NUM,
    pageSize: PAGINATION.ALL_DATA, // 获取所有设备组
  });

  console.log('🔍 fetchDeviceGroups API响应:', response);

  // 检查HTTP状态码和业务状态码
  if (!isApiSuccess(response.code)) {
    throw new Error(response.msg || '获取设备组列表失败');
  }

  // 确保数据存在
  if (!response.data || !response.data.pageData) {
    throw new Error('设备组响应数据格式错误');
  }

  const result = response.data.pageData;
  console.log('📦 fetchDeviceGroups 返回数据:', result);

  return result;
});

/**
 * 批量更新设备配置
 */
export const batchUpdateDeviceConfig = createAsyncThunk<
  void,
  { deviceIds: number[]; minTemp: number; maxTemp: number }
>('device/batchUpdateConfig', async ({ deviceIds, minTemp, maxTemp }) => {
  const response = await updateDeviceConfig({
    deviceIdList: deviceIds,
    minSettingTemp: minTemp,
    maxSettingTemp: maxTemp,
  });

  if (!isApiSuccess(response.code)) {
    throw new Error(response.msg || '更新设备配置失败');
  }
});

// ============ Slice定义 ============

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    /**
     * 设置选中的设备ID列表
     */
    setSelectedDeviceIds(state, action: PayloadAction<number[]>) {
      state.selectedDeviceIds = action.payload;
    },

    /**
     * 清空选择
     */
    clearSelection(state) {
      state.selectedDeviceIds = [];
    },

    /**
     * 切换设备选择状态
     */
    toggleDeviceSelection(state, action: PayloadAction<number>) {
      const deviceId = action.payload;
      const index = state.selectedDeviceIds.indexOf(deviceId);
      
      if (index >= 0) {
        state.selectedDeviceIds.splice(index, 1);
      } else {
        state.selectedDeviceIds.push(deviceId);
      }
    },

    /**
     * 全选/取消全选当前页设备
     */
    toggleSelectAll(state) {
      const currentPageDeviceIds = state.devices.map(device => device.deviceId);
      const allSelected = currentPageDeviceIds.every(id => 
        state.selectedDeviceIds.includes(id)
      );

      if (allSelected) {
        // 取消选择当前页的所有设备
        state.selectedDeviceIds = state.selectedDeviceIds.filter(id => 
          !currentPageDeviceIds.includes(id)
        );
      } else {
        // 选择当前页的所有设备
        currentPageDeviceIds.forEach(id => {
          if (!state.selectedDeviceIds.includes(id)) {
            state.selectedDeviceIds.push(id);
          }
        });
      }
    },

    /**
     * 设置查询过滤器
     */
    setFilters(state, action: PayloadAction<Partial<DeviceFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },

    /**
     * 重置过滤器
     */
    resetFilters(state) {
      state.filters = {
        pageNum: PAGINATION.DEFAULT_PAGE_NUM,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
      };
    },

    /**
     * 清除错误
     */
    clearError(state) {
      state.error = undefined;
    },
  },

  extraReducers: (builder) => {
    // 获取设备列表
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        console.log('🎉 fetchDevices fulfilled:', action.payload);
        state.loading = false;
        state.devices = action.payload.devices;
        state.total = action.payload.total;
        state.error = undefined; // 清除错误状态
        console.log('📊 Redux state updated - devices:', state.devices.length, 'total:', state.total);
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取设备列表失败';
      });

    // 获取设备组列表
    builder
      .addCase(fetchDeviceGroups.pending, (state) => {
        state.loading = true;
        state.error = undefined; // 清除之前的错误
      })
      .addCase(fetchDeviceGroups.fulfilled, (state, action) => {
        console.log('🎉 fetchDeviceGroups fulfilled:', action.payload);
        state.loading = false;
        state.deviceGroups = action.payload;
        state.error = undefined; // 清除错误状态
        console.log('📊 Redux state updated - deviceGroups:', state.deviceGroups.length);
      })
      .addCase(fetchDeviceGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取设备组列表失败';
      });

    // 批量更新设备配置
    builder
      .addCase(batchUpdateDeviceConfig.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(batchUpdateDeviceConfig.fulfilled, (state) => {
        state.loading = false;
        // 清空选择
        state.selectedDeviceIds = [];
      })
      .addCase(batchUpdateDeviceConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新设备配置失败';
      });
  },
});

export const {
  setSelectedDeviceIds,
  clearSelection,
  toggleDeviceSelection,
  toggleSelectAll,
  setFilters,
  resetFilters,
  clearError,
} = deviceSlice.actions;

export default deviceSlice.reducer;
