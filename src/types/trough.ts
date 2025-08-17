/**
 * 设备相关类型定义
 * 直接使用新的API类型，不考虑向后兼容
 */

// 重新导出新的API类型
export type {
  DeviceItem,
  DeviceGroupItem,
  QueryDevicesRequest,
  QueryDevicesResponse,
  UpdateDeviceConfigRequest,
  UpdateDeviceConfigResponse,
  GetDeviceGroupListRequest,
  GetDeviceGroupListResponse,
  PaginationData,
} from './api';

export {
  AlarmType,
  AlarmTypeLabels,
  AlarmTypeColors,
  PAGINATION,
} from './enums';