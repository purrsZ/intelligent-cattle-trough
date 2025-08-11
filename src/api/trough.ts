import client from './client';
import { TroughListResponse, TemperatureUpdatePayload, TroughStatus } from '../types/trough';

/**
 * 获取饲槽列表
 */
export async function fetchTroughList(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: TroughStatus;
}): Promise<TroughListResponse> {
  const { data } = await client.get<TroughListResponse>('/troughs', { params });
  return data;
}

/**
 * 批量更新温度区间
 */
export async function updateTroughTemperature(payload: TemperatureUpdatePayload): Promise<{ success: boolean }>
{
  const { data } = await client.post<{ success: boolean }>('/troughs/temperature', payload);
  return data;
}


