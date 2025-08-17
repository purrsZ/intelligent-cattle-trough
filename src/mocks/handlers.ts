/**
 * Mock API 处理器
 * 模拟三个核心API接口的响应
 */

import { http, HttpResponse } from 'msw';
import { deviceDataset, deviceGroupDataset } from './data';
import type {
  QueryDevicesResponse,
  GetDeviceGroupListResponse,
  UpdateDeviceConfigRequest,
  UpdateDeviceConfigResponse,
  DeviceItem,
  DeviceGroupItem,
} from '../types/trough';

export const handlers = [
  // 接口1：获取设备组列表
  http.post('/api/ctc/group/list', async ({ request }) => {
    const body = await request.json() as { pageNum: number; pageSize: number };
    const pageNum = body.pageNum || 1;
    const pageSize = body.pageSize || 10;

    let list: DeviceGroupItem[] = deviceGroupDataset;

    // 分页处理
    let pageData: DeviceGroupItem[];
    let total: number;
    let totalPage: number;

    if (pageSize === 0) {
      // 查询全部
      pageData = list;
      total = list.length;
      totalPage = 1;
    } else {
      // 分页查询
      const start = (pageNum - 1) * pageSize;
      pageData = list.slice(start, start + pageSize);
      total = list.length;
      totalPage = Math.ceil(total / pageSize);
    }

    const response: GetDeviceGroupListResponse = {
      code: 0,
      data: {
        pageData,
        pageNum,
        pageSize,
        total,
        totalPage,
      },
      msg: 'success',
    };

    return HttpResponse.json(response);
  }),

  // 接口2：修改设备配置（批量）
  http.post('/api/ctc/device/batchUpdateSettings', async ({ request }) => {
    try {
      const body = (await request.json()) as UpdateDeviceConfigRequest;
      
      if (!body || !Array.isArray(body.deviceIdList) || body.deviceIdList.length === 0) {
        const errorResponse: UpdateDeviceConfigResponse = {
          code: 40000,
          msg: '参数错误：设备ID列表不能为空',
        };
        return HttpResponse.json(errorResponse, { status: 400 });
      }

      if (typeof body.minSettingTemp !== 'number' || typeof body.maxSettingTemp !== 'number') {
        const errorResponse: UpdateDeviceConfigResponse = {
          code: 40000,
          msg: '参数错误：温度设置必须为数字',
        };
        return HttpResponse.json(errorResponse, { status: 400 });
      }

      if (body.minSettingTemp >= body.maxSettingTemp) {
        const errorResponse: UpdateDeviceConfigResponse = {
          code: 40000,
          msg: '参数错误：最低温度必须小于最高温度',
        };
        return HttpResponse.json(errorResponse, { status: 400 });
      }

      // 模拟更新设备配置
      console.log('批量更新设备配置:', body);

      const response: UpdateDeviceConfigResponse = {
        code: 0,
        msg: 'success',
      };

      return HttpResponse.json(response);
    } catch (error) {
      const errorResponse: UpdateDeviceConfigResponse = {
        code: 50000,
        msg: '服务器错误',
      };
      return HttpResponse.json(errorResponse, { status: 500 });
    }
  }),

  // 接口3：查询设备
  http.post('/api/ctc/device/list', async ({ request }) => {
    const body = await request.json() as { 
      pageNum?: number; 
      pageSize?: number; 
      alarmType?: number; 
      deviceName?: string; 
      groupId?: number; 
    };
    
    const pageNum = body.pageNum || 1;
    const pageSize = body.pageSize || 10;
    const alarmType = body.alarmType;
    const deviceName = body.deviceName;
    const groupId = body.groupId;

    let list: DeviceItem[] = deviceDataset;

    // 过滤条件
    if (alarmType !== undefined && alarmType !== null) {
      list = list.filter(device => device.alarmType === alarmType);
    }

    if (deviceName) {
      list = list.filter(device => device.deviceName.includes(deviceName));
    }

    if (groupId !== undefined && groupId !== null) {
      list = list.filter(device => device.groupId === groupId);
    }

    // 分页处理
    let pageData: DeviceItem[];
    let total: number;
    let totalPage: number;

    if (pageSize === 0) {
      // 查询全部
      pageData = list;
      total = list.length;
      totalPage = 1;
    } else {
      // 分页查询
      const start = (pageNum - 1) * pageSize;
      pageData = list.slice(start, start + pageSize);
      total = list.length;
      totalPage = Math.ceil(total / pageSize);
    }

    const response: QueryDevicesResponse = {
      code: 0,
      data: {
        pageData,
        pageNum,
        pageSize,
        total,
        totalPage,
      },
      msg: 'success',
    };

    return HttpResponse.json(response);
  }),
];