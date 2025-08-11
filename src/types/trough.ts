/**
 * 饲槽设备状态
 */
export type TroughStatus = 'normal' | 'warning' | 'error';

/**
 * 饲槽设备实体
 */
export interface Trough {
  id: string;
  name: string;
  currentTemperature: number;
  status: TroughStatus;
  updatedAt: string;
}

/**
 * 饲槽列表接口响应
 */
export interface TroughListResponse {
  list: Trough[];
  total: number;
}

/**
 * 批量温度设置请求体
 */
export interface TemperatureUpdatePayload {
  troughIds: string[];
  min: number;
  max: number;
}


