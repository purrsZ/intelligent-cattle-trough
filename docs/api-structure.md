# API 项目结构

## 文件结构

```
src/
├── api/
│   ├── client.ts          # HTTP 客户端配置
│   ├── core.ts            # 核心API服务（三个接口）
│   └── index.ts           # 统一导出和工具函数
├── types/
│   ├── api.ts             # API 接口类型定义
│   └── enums.ts           # 枚举常量定义
└── examples/
    └── api-usage.ts       # 使用示例

docs/
└── api-interfaces.md      # 接口详细文档
```

## 核心文件说明

### `src/api/core.ts`
包含三个核心API函数：
- `getDeviceGroupList()` - 获取设备组列表
- `updateDeviceConfig()` - 修改设备配置（批量）
- `queryDevices()` - 查询设备

### `src/types/api.ts`
定义所有接口的TypeScript类型：
- 请求参数类型
- 响应数据类型
- 数据实体类型

### `src/types/enums.ts`
枚举常量定义：
- `AlarmType` - 告警状态枚举
- `ApiCode` - API响应码
- `PAGINATION` - 分页常量

### `src/api/index.ts`
统一导出入口，包含：
- API函数导出
- 类型定义导出
- 工具函数（状态标签、颜色、错误处理等）

## 使用方式

### 基础导入
```typescript
import { 
  queryDevices, 
  getDeviceGroupList, 
  updateDeviceConfig,
  AlarmType,
  PAGINATION 
} from '../api';
```

### 类型导入
```typescript
import type { 
  DeviceItem, 
  DeviceGroupItem,
  QueryDevicesRequest 
} from '../api';
```

## 严格的TypeScript规范

1. **完整类型覆盖**：所有接口都有完整的类型定义
2. **枚举使用**：使用TypeScript枚举而非魔法数字
3. **类型安全**：编译时类型检查，避免运行时错误
4. **一致性**：统一的命名规范和代码风格

## 接口对应关系

| 序号 | 接口名称             | API函数              | 端点                                   | 请求类型                    | 响应类型                     |
| ---- | -------------------- | -------------------- | -------------------------------------- | --------------------------- | ---------------------------- |
| 1    | 获取设备组列表       | `getDeviceGroupList` | `POST /ctc/group/list`                 | `GetDeviceGroupListRequest` | `GetDeviceGroupListResponse` |
| 2    | 修改设备配置（批量） | `updateDeviceConfig` | `POST /ctc/device/batchUpdateSettings` | `UpdateDeviceConfigRequest` | `UpdateDeviceConfigResponse` |
| 3    | 查询设备             | `queryDevices`       | `POST /ctc/device/list`                | `QueryDevicesRequest`       | `QueryDevicesResponse`       |

所有接口都遵循统一的设计模式，确保代码的可维护性和扩展性。
