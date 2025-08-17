# API 接口文档

## 概述

本文档详细描述智能牛槽监控系统的三个核心API接口，严格按照TypeScript规范实现。

## 接口列表

### 1. 获取设备组列表

**接口路径**: `POST /ctc/group/list`

**请求参数**:
```typescript
interface GetDeviceGroupListRequest {
  pageNum: number;     // 页码
  pageSize: number;    // 每页数据量，传0查全部
}
```

**响应数据**:
```typescript
interface GetDeviceGroupListResponse {
  code: number;        // 返回码，00000：成功
  data: {
    pageData: DeviceGroupItem[];  // 页数据
    pageNum: number;              // 页码
    pageSize: number;             // 页容量
    total: number;                // 总数
    totalPage: number;            // 总页数
  };
  msg: string;         // 返回描述
}

interface DeviceGroupItem {
  alarmType: number;   // 告警状态，0: 无告警, 1: 需检查, 2: 温度过低, 3: 温度过高
  groupId?: number;    // 设备组ID
  groupName?: string;  // 设备组名称
}
```

**使用示例**:
```typescript
import { getDeviceGroupList, PAGINATION } from '../api';

const response = await getDeviceGroupList({
  pageNum: PAGINATION.DEFAULT_PAGE_NUM,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
});
```

---

### 2. 修改设备配置（批量）

**接口路径**: `POST /ctc/device/batchUpdateSettings`

**请求参数**:
```typescript
interface UpdateDeviceConfigRequest {
  deviceIdList: number[];   // 被修改的设备ID
  maxSettingTemp: number;   // 设定温度上限
  minSettingTemp: number;   // 设定温度下限
}
```

**响应数据**:
```typescript
interface UpdateDeviceConfigResponse {
  code: number;   // 返回码，00000：成功
  msg: string;    // 返回描述
}
```

**使用示例**:
```typescript
import { updateDeviceConfig } from '../api';

const response = await updateDeviceConfig({
  deviceIdList: [1, 2, 3],
  minSettingTemp: 15,
  maxSettingTemp: 25,
});
```

---

### 3. 查询设备

**接口路径**: `POST /ctc/device/list`

**请求参数**:
```typescript
interface QueryDevicesRequest {
  alarmType?: number;    // 告警状态，0: 无告警, 1: 需检查, 2: 温度过低, 3: 温度过高
  deviceName?: string;   // 设备名称
  groupId?: number;      // 设备组id
  pageNum: number;       // 页码
  pageSize: number;      // 每页数据量，传0查全部
}
```

**响应数据**:
```typescript
interface QueryDevicesResponse {
  code: number;        // 返回码，00000：成功
  data: {
    pageData: DeviceItem[];  // 页数据
    pageNum: number;         // 页码
    pageSize: number;        // 页容量
    total: number;           // 总数
    totalPage: number;       // 总页数
  };
  msg: string;         // 返回描述
}

interface DeviceItem {
  alarmType: number;        // 告警状态，0: 无告警, 1: 需检查, 2: 温度过低, 3: 温度过高
  createTime: string;       // 创建时间
  currentTemp: number;      // 当前温度
  deviceId: number;         // 设备Id
  deviceName: string;       // 设备名
  deviceUuid: string;       // 设备UUID，硬件唯一标识
  groupId: number;          // 归属组id
  maxSettingTemp: number;   // 设定温度上限
  minSettingTemp: number;   // 设定温度下限
  tempUpdateTime?: string;  // 上次温度更新时间
  updateTime: string;       // 更新时间
}
```

**使用示例**:
```typescript
import { queryDevices, AlarmType } from '../api';

const response = await queryDevices({
  pageNum: 1,
  pageSize: 10,
  alarmType: AlarmType.NO_ALARM,
  deviceName: '牛槽',
  groupId: 1,
});
```

## 枚举定义

### 告警状态 (AlarmType)

```typescript
enum AlarmType {
  NO_ALARM = 0,         // 无告警
  NEED_INSPECTION = 1,  // 需要检查
  LOW_TEMPERATURE = 2,  // 温度过低
  HIGH_TEMPERATURE = 3, // 温度过高
}
```

### 分页常量

```typescript
const PAGINATION = {
  DEFAULT_PAGE_NUM: 1,    // 默认页码
  DEFAULT_PAGE_SIZE: 10,  // 默认页大小
  ALL_DATA: 0,           // 查询全部时的页大小
};
```

## 工具函数

### 状态相关

```typescript
// 获取告警状态标签
getAlarmTypeLabel(alarmType: AlarmType): string

// 获取告警状态颜色
getAlarmTypeColor(alarmType: AlarmType): string

// 检查API响应是否成功
isApiSuccess(code: number): boolean

// 格式化错误信息
formatApiError(error: any): string
```

## 使用规范

### 1. 导入方式

```typescript
// 导入API函数
import { 
  getDeviceGroupList, 
  updateDeviceConfig, 
  queryDevices 
} from '../api';

// 导入类型定义
import type { 
  DeviceItem, 
  DeviceGroupItem 
} from '../api';

// 导入枚举和常量
import { 
  AlarmType, 
  PAGINATION 
} from '../api';
```

### 2. 错误处理

```typescript
try {
  const response = await queryDevices(params);
  
  if (isApiSuccess(response.code)) {
    // 处理成功响应
    const devices = response.data.pageData;
  } else {
    // 处理业务错误
    console.error('业务错误:', response.msg);
  }
} catch (error) {
  // 处理网络错误
  console.error('网络错误:', formatApiError(error));
}
```

### 3. 类型安全

所有接口都提供完整的TypeScript类型定义，确保编译时类型检查：

```typescript
// ✅ 正确使用
const request: QueryDevicesRequest = {
  pageNum: 1,
  pageSize: 10,
  alarmType: AlarmType.NO_ALARM,
};

// ❌ 类型错误
const request: QueryDevicesRequest = {
  pageNum: "1",  // 类型错误：应为number
  pageSize: 10,
};
```

## 返回数据结构总结

### 设备组列表返回数据
```json
{
  "code": 0,
  "data": {
    "pageData": [
      {
        "alarmType": 0,
        "groupId": 1,
        "groupName": "A区牛槽组"
      }
    ],
    "pageNum": 1,
    "pageSize": 10,
    "total": 1,
    "totalPage": 1
  },
  "msg": "success"
}
```

### 设备配置更新返回数据
```json
{
  "code": 0,
  "msg": "success"
}
```

### 设备查询返回数据
```json
{
  "code": 0,
  "data": {
    "pageData": [
      {
        "alarmType": 0,
        "createTime": "2024-01-01 10:00:00",
        "currentTemp": 20.5,
        "deviceId": 1,
        "deviceName": "A区牛槽001",
        "deviceUuid": "uuid-123-456",
        "groupId": 1,
        "maxSettingTemp": 25,
        "minSettingTemp": 15,
        "tempUpdateTime": "2024-01-01 15:30:00",
        "updateTime": "2024-01-01 15:30:00"
      }
    ],
    "pageNum": 1,
    "pageSize": 10,
    "total": 1,
    "totalPage": 1
  },
  "msg": "success"
}
```
