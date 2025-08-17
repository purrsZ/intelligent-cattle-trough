/**
 * API 核心类型定义
 * 严格按照提供的三个接口定义
 */

// ============ 通用类型 ============

/**
 * API 标准响应结构
 */
export interface ApiResponse<T = any> {
  /** 返回码，00000：成功 */
  code: number;
  /** 数据 */
  data: T;
  /** 返回描述 */
  msg: string;
}

/**
 * 简单响应结构（无数据）
 */
export interface SimpleApiResponse {
  /** 返回码，00000：成功 */
  code: number;
  /** 返回描述 */
  msg: string;
}

/**
 * 分页响应数据结构
 */
export interface PaginationData<T> {
  /** 页数据 */
  pageData: T[];
  /** 页码 */
  pageNum: number;
  /** 页容量 */
  pageSize: number;
  /** 总数 */
  total: number;
  /** 总页数 */
  totalPage: number;
}

// ============ 接口1：获取设备组列表 ============

/**
 * 获取设备组列表 - 请求参数
 */
export interface GetDeviceGroupListRequest {
  /** 页码 */
  pageNum: number;
  /** 每页数据量，传0查全部 */
  pageSize: number;
}

/**
 * 设备组数据
 */
export interface DeviceGroupItem {
  /** 告警状态，0: 无告警, 1: 需检查, 2: 温度过低, 3: 温度过高 */
  alarmType: number;
  /** 设备组ID */
  groupId?: number;
  /** 设备组名称 */
  groupName?: string;
}

/**
 * 获取设备组列表 - 响应数据
 */
export interface GetDeviceGroupListResponse extends ApiResponse<PaginationData<DeviceGroupItem>> {}

// ============ 接口2：修改设备配置（批量） ============

/**
 * 修改设备配置（批量）- 请求参数
 */
export interface UpdateDeviceConfigRequest {
  /** 被修改的设备ID */
  deviceIdList: number[];
  /** 设定温度上限 */
  maxSettingTemp: number;
  /** 设定温度下限 */
  minSettingTemp: number;
}

/**
 * 修改设备配置（批量）- 响应数据
 */
export interface UpdateDeviceConfigResponse extends SimpleApiResponse {}

// ============ 接口3：查询设备 ============

/**
 * 查询设备 - 请求参数
 */
export interface QueryDevicesRequest {
  /** 告警状态，0: 无告警, 1: 需检查, 2: 温度过低, 3: 温度过高 */
  alarmType?: number;
  /** 设备名称 */
  deviceName?: string;
  /** 设备组id */
  groupId?: number;
  /** 页码 */
  pageNum: number;
  /** 每页数据量，传0查全部 */
  pageSize: number;
}

/**
 * 设备数据
 */
export interface DeviceItem {
  /** 告警状态，0: 无告警, 1: 需检查, 2: 温度过低, 3: 温度过高 */
  alarmType: number;
  /** 创建时间 */
  createTime: string;
  /** 当前温度 */
  currentTemp: number;
  /** 设备Id */
  deviceId: number;
  /** 设备名 */
  deviceName: string;
  /** 设备状态 */
  deviceStatus: string;
  /** 设备UUID，硬件唯一标识 */
  deviceUuid: string;
  /** 归属组id */
  groupId: number;
  /** 设定温度上限 */
  maxSettingTemp: number;
  /** 设定温度下限 */
  minSettingTemp: number;
  /** 上次温度更新时间 */
  tempUpdateTime?: string;
  /** 更新时间 */
  updateTime: string;
}

/**
 * 查询设备 - 响应数据
 */
export interface QueryDevicesResponse extends ApiResponse<PaginationData<DeviceItem>> {}