/**
 * Mock 数据生成
 * 使用新的API数据结构
 */

import { DeviceItem, DeviceGroupItem, AlarmType } from '../types/trough';

/**
 * 生成随机设备组数据
 */
function createDeviceGroup(i: number): DeviceGroupItem {
  const alarmTypes = [AlarmType.NO_ALARM, AlarmType.NEED_INSPECTION, AlarmType.LOW_TEMPERATURE, AlarmType.HIGH_TEMPERATURE];
  
  return {
    groupId: i + 1,
    groupName: `设备组-${String.fromCharCode(65 + i)}`, // A组、B组、C组...
    alarmType: alarmTypes[i % alarmTypes.length],
  };
}

/**
 * 生成随机设备数据
 */
function createDevice(i: number): DeviceItem {
  const alarmTypes = [AlarmType.NO_ALARM, AlarmType.NEED_INSPECTION, AlarmType.LOW_TEMPERATURE, AlarmType.HIGH_TEMPERATURE];
  const groupCount = 5; // 假设有5个设备组
  const now = new Date();
  const updateTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000); // 最近7天内的随机时间
  
  // 生成温度，根据告警状态调整
  const alarmType = alarmTypes[i % alarmTypes.length];
  let currentTemp: number;
  
  switch (alarmType) {
    case AlarmType.LOW_TEMPERATURE:
      currentTemp = Math.round((Math.random() * 5 + 5) * 10) / 10; // 5-10度
      break;
    case AlarmType.HIGH_TEMPERATURE:
      currentTemp = Math.round((Math.random() * 10 + 30) * 10) / 10; // 30-40度
      break;
    default:
      currentTemp = Math.round((Math.random() * 15 + 15) * 10) / 10; // 15-30度
  }

  return {
    deviceId: i + 1,
    deviceName: `智能牛槽-${String(i + 1).padStart(3, '0')}`,
    deviceUuid: `device-uuid-${i + 1}-${Math.random().toString(36).substr(2, 9)}`,
    currentTemp: currentTemp,
    deviceStatus: Math.random() > 0.3 ? 'ON' : 'OFF', // 随机设备状态
    alarmType: alarmType,
    groupId: (i % groupCount) + 1,
    minSettingTemp: 10,
    maxSettingTemp: 25,
    createTime: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // 最近30天内创建
    updateTime: updateTime.toISOString(),
    tempUpdateTime: new Date(updateTime.getTime() + Math.random() * 60 * 60 * 1000).toISOString(), // 更新时间后的1小时内
  };
}

/**
 * 设备组数据集
 */
export const deviceGroupDataset: DeviceGroupItem[] = Array.from({ length: 5 }).map((_, i) => createDeviceGroup(i));

/**
 * 设备数据集
 */
export const deviceDataset: DeviceItem[] = Array.from({ length: 87 }).map((_, i) => createDevice(i));