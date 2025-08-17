/**
 * 核心API服务
 * 仅包含三个核心接口的实现
 */

import client from './client';
import type {
  GetDeviceGroupListRequest,
  GetDeviceGroupListResponse,
  UpdateDeviceConfigRequest,
  UpdateDeviceConfigResponse,
  QueryDevicesRequest,
  QueryDevicesResponse,
} from '../types/api';

// ============ 接口1：获取设备组列表 ============

/**
 * 获取设备组列表
 * @param params 查询参数
 * @returns Promise<GetDeviceGroupListResponse>
 */
export const getDeviceGroupList = async (
  params: GetDeviceGroupListRequest
): Promise<GetDeviceGroupListResponse> => {
  const response = await client.post<GetDeviceGroupListResponse>('/ctc/group/list', params);
  return response.data;
};

// ============ 接口2：修改设备配置（批量） ============

/**
 * 修改设备配置（批量）
 * @param data 配置参数
 * @returns Promise<UpdateDeviceConfigResponse>
 */
export const updateDeviceConfig = async (
  data: UpdateDeviceConfigRequest
): Promise<UpdateDeviceConfigResponse> => {
  const response = await client.post<UpdateDeviceConfigResponse>(
    '/ctc/device/batchUpdateSettings',
    data
  );
  return response.data;
};

// ============ 接口3：查询设备 ============

/**
 * 查询设备
 * @param params 查询参数
 * @returns Promise<QueryDevicesResponse>
 */
export const queryDevices = async (
  params: QueryDevicesRequest
): Promise<QueryDevicesResponse> => {
  const response = await client.post<QueryDevicesResponse>('/ctc/device/list', params);
  return response.data;
};
