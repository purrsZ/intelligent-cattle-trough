/**
 * API 统一入口
 * 导出核心API服务和类型定义
 */

import { AlarmType, AlarmTypeLabels, AlarmTypeColors, ApiCode } from '../types/enums';

// ============ 核心API服务 ============
export * from './core';

// ============ 类型定义 ============
export * from '../types/api';
export * from '../types/enums';

// ============ 工具函数 ============

/**
 * 获取告警状态的显示文本
 * @param alarmType 告警状态
 * @returns 显示文本
 */
export const getAlarmTypeLabel = (alarmType: AlarmType): string => {
  return AlarmTypeLabels[alarmType] || '未知状态';
};

/**
 * 获取告警状态的颜色
 * @param alarmType 告警状态
 * @returns 颜色值
 */
export const getAlarmTypeColor = (alarmType: AlarmType): string => {
  return AlarmTypeColors[alarmType] || '#666666';
};

/**
 * 检查API响应是否成功
 * @param code 响应码
 * @returns 是否成功
 */
export const isApiSuccess = (code: number): boolean => {
  return code === ApiCode.SUCCESS;
};

/**
 * 格式化API错误信息
 * @param error 错误对象
 * @returns 格式化的错误信息
 */
export const formatApiError = (error: any): string => {
  // 新的fetch客户端HttpError错误处理
  if (error?.response?.data?.msg) {
    return error.response.data.msg;
  }
  if (error?.message) {
    return error.message;
  }
  return '网络请求失败，请稍后重试';
};