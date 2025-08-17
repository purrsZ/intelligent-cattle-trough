/**
 * 枚举常量定义
 * 严格按照接口文档定义
 */

/**
 * 告警状态枚举
 * const AlarmType = {
 *   NO_ALARM: 0,
 *   NEED_INSPECTION: 1,
 *   LOW_TEMPERATURE: 2,
 *   HIGH_TEMPERATURE: 3,
 * };
 */
export enum AlarmType {
  /** 无告警 */
  NO_ALARM = 0,
  /** 需要检查 */
  NEED_INSPECTION = 1,
  /** 温度过低 */
  LOW_TEMPERATURE = 2,
  /** 温度过高 */
  HIGH_TEMPERATURE = 3,
}

/**
 * 告警状态标签映射
 */
export const AlarmTypeLabels: Record<AlarmType, string> = {
  [AlarmType.NO_ALARM]: '无告警',
  [AlarmType.NEED_INSPECTION]: '需要检查',
  [AlarmType.LOW_TEMPERATURE]: '温度过低',
  [AlarmType.HIGH_TEMPERATURE]: '温度过高',
} as const;

/**
 * 告警状态颜色映射（用于UI显示）
 */
export const AlarmTypeColors: Record<AlarmType, string> = {
  [AlarmType.NO_ALARM]: '#52c41a',      // 绿色
  [AlarmType.NEED_INSPECTION]: '#faad14', // 橙色
  [AlarmType.LOW_TEMPERATURE]: '#1890ff', // 蓝色
  [AlarmType.HIGH_TEMPERATURE]: '#f5222d', // 红色
} as const;

/**
 * API 响应码
 */
export enum ApiCode {
  /** 成功 */
  SUCCESS = 200,
}

/**
 * 分页默认配置
 */
export const PAGINATION = {
  /** 默认页码 */
  DEFAULT_PAGE_NUM: 1,
  /** 默认页大小 */
  DEFAULT_PAGE_SIZE: 10,
  /** 查询全部时的页大小 */
  ALL_DATA: 0, // API文档指定：传0查全部
} as const;