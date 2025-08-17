/**
 * API 使用示例
 * 展示三个核心接口的使用方法
 */

import {
  getDeviceGroupList,
  updateDeviceConfig,
  queryDevices,
  AlarmType,
  PAGINATION,
  isApiSuccess,
  formatApiError,
  getAlarmTypeLabel,
} from '../api';

// ============ 接口1：获取设备组列表 ============

/**
 * 示例1：获取设备组列表（分页）
 */
export const exampleGetDeviceGroupList = async () => {
  try {
    const response = await getDeviceGroupList({
      pageNum: PAGINATION.DEFAULT_PAGE_NUM,
      pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    });

    if (isApiSuccess(response.code)) {
      console.log('获取设备组列表成功：');
      console.log('总数：', response.data.total);
      console.log('当前页：', response.data.pageNum);
      console.log('每页数量：', response.data.pageSize);
      console.log('总页数：', response.data.totalPage);
      
      response.data.pageData.forEach(group => {
        console.log(`设备组ID: ${group.groupId}`);
        console.log(`设备组名称: ${group.groupName}`);
        console.log(`告警状态: ${getAlarmTypeLabel(group.alarmType)}`);
        console.log('---');
      });
    } else {
      console.error('获取设备组列表失败：', response.msg);
    }
  } catch (error) {
    console.error('请求失败：', formatApiError(error));
  }
};

/**
 * 示例2：获取所有设备组（不分页）
 */
export const exampleGetAllDeviceGroups = async () => {
  try {
    const response = await getDeviceGroupList({
      pageNum: PAGINATION.DEFAULT_PAGE_NUM,
      pageSize: PAGINATION.ALL_DATA, // 传0查全部
    });

    if (isApiSuccess(response.code)) {
      console.log('所有设备组：', response.data.pageData);
    }
  } catch (error) {
    console.error('获取所有设备组失败：', formatApiError(error));
  }
};

// ============ 接口2：修改设备配置（批量） ============

/**
 * 示例3：批量修改设备温度配置
 */
export const exampleUpdateDeviceConfig = async () => {
  try {
    const response = await updateDeviceConfig({
      deviceIdList: [1, 2, 3, 4, 5], // 要修改的设备ID列表
      minSettingTemp: 15, // 设定温度下限
      maxSettingTemp: 25, // 设定温度上限
    });

    if (isApiSuccess(response.code)) {
      console.log('设备配置更新成功');
    } else {
      console.error('设备配置更新失败：', response.msg);
    }
  } catch (error) {
    console.error('批量更新设备配置失败：', formatApiError(error));
  }
};

/**
 * 示例4：单个设备配置更新
 */
export const exampleUpdateSingleDeviceConfig = async (deviceId: number) => {
  try {
    const response = await updateDeviceConfig({
      deviceIdList: [deviceId],
      minSettingTemp: 18,
      maxSettingTemp: 28,
    });

    if (isApiSuccess(response.code)) {
      console.log(`设备${deviceId}配置更新成功`);
    }
  } catch (error) {
    console.error('更新单个设备配置失败：', formatApiError(error));
  }
};

// ============ 接口3：查询设备 ============

/**
 * 示例5：查询设备列表（基础查询）
 */
export const exampleQueryDevices = async () => {
  try {
    const response = await queryDevices({
      pageNum: PAGINATION.DEFAULT_PAGE_NUM,
      pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    });

    if (isApiSuccess(response.code)) {
      console.log('查询设备成功：');
      response.data.pageData.forEach(device => {
        console.log(`设备ID: ${device.deviceId}`);
        console.log(`设备名称: ${device.deviceName}`);
        console.log(`当前温度: ${device.currentTemp}°C`);
        console.log(`告警状态: ${getAlarmTypeLabel(device.alarmType)}`);
        console.log(`所属设备组: ${device.groupId}`);
        console.log('---');
      });
    }
  } catch (error) {
    console.error('查询设备失败：', formatApiError(error));
  }
};

/**
 * 示例6：按告警状态查询设备
 */
export const exampleQueryDevicesByAlarmType = async (alarmType: AlarmType) => {
  try {
    const response = await queryDevices({
      pageNum: PAGINATION.DEFAULT_PAGE_NUM,
      pageSize: PAGINATION.ALL_DATA,
      alarmType,
    });

    if (isApiSuccess(response.code)) {
      console.log(`${getAlarmTypeLabel(alarmType)}的设备数量: ${response.data.total}`);
      return response.data.pageData;
    }
  } catch (error) {
    console.error('按告警状态查询设备失败：', formatApiError(error));
    return [];
  }
};

/**
 * 示例7：按设备组查询设备
 */
export const exampleQueryDevicesByGroup = async (groupId: number) => {
  try {
    const response = await queryDevices({
      pageNum: PAGINATION.DEFAULT_PAGE_NUM,
      pageSize: PAGINATION.ALL_DATA,
      groupId,
    });

    if (isApiSuccess(response.code)) {
      console.log(`设备组${groupId}的设备数量: ${response.data.total}`);
      return response.data.pageData;
    }
  } catch (error) {
    console.error('按设备组查询设备失败：', formatApiError(error));
    return [];
  }
};

/**
 * 示例8：按设备名称搜索
 */
export const exampleSearchDevicesByName = async (deviceName: string) => {
  try {
    const response = await queryDevices({
      pageNum: PAGINATION.DEFAULT_PAGE_NUM,
      pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
      deviceName,
    });

    if (isApiSuccess(response.code)) {
      console.log(`搜索"${deviceName}"的结果: ${response.data.total}个设备`);
      return response.data.pageData;
    }
  } catch (error) {
    console.error('按名称搜索设备失败：', formatApiError(error));
    return [];
  }
};

/**
 * 示例9：复合条件查询
 */
export const exampleComplexQuery = async () => {
  try {
    const response = await queryDevices({
      pageNum: 1,
      pageSize: 20,
      alarmType: AlarmType.HIGH_TEMPERATURE, // 只查询温度过高的设备
      groupId: 1, // 在设备组1中
      deviceName: '牛槽', // 名称包含"牛槽"
    });

    if (isApiSuccess(response.code)) {
      console.log('复合条件查询结果：', response.data);
    }
  } catch (error) {
    console.error('复合条件查询失败：', formatApiError(error));
  }
};
