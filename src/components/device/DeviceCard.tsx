/**
 * 设备卡片组件
 * 展示单个设备的信息和状态
 */

import React from 'react';
import { Card, Checkbox, Space, Typography, Tooltip } from 'antd';
import { FireOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { DeviceItem } from '../../types/trough';
import { AlarmBadge } from './AlarmBadge';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

export interface DeviceCardProps {
  /** 设备数据 */
  device: DeviceItem;
  /** 是否被选中 */
  selected?: boolean;
  /** 选择状态变更回调 */
  onToggle?: (deviceId: number) => void;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/**
 * 设备卡片组件
 */
export const DeviceCard = React.memo<DeviceCardProps>(function DeviceCard({
  device,
  selected = false,
  onToggle,
  style,
}) {
  // 处理选择状态变更
  const handleToggle = React.useCallback(() => {
    onToggle?.(device.deviceId);
  }, [onToggle, device.deviceId]);

  // 格式化温度显示
  const temperatureDisplay = `${device.currentTemp}°C`;

  // 格式化更新时间
  const updateTimeDisplay = device.tempUpdateTime 
    ? dayjs(device.tempUpdateTime).format('MM-DD HH:mm')
    : '未知';

  return (
    <Card
      size="small"
      style={{
        width: '100%',
        cursor: onToggle ? 'pointer' : 'default',
        border: selected ? '2px solid #1890ff' : '1px solid #d9d9d9',
        backgroundColor: selected ? '#f6ffed' : '#ffffff',
        boxSizing: 'border-box',
        padding: selected ? '15px' : '16px', // 补偿边框差异，保持内容区域大小一致
        ...style,
      }}
      onClick={handleToggle}
      hoverable={!!onToggle}
    >
      <div style={{ position: 'relative' }}>
        {/* 选择框 */}
        {onToggle && (
          <Checkbox
            checked={selected}
            onChange={handleToggle}
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              zIndex: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {/* 设备名称 */}
        <Title level={5} style={{ margin: '0 0 8px 0', fontSize: 14 }}>
          <Tooltip title={`设备ID: ${device.deviceId}`}>
            {device.deviceName}
          </Tooltip>
        </Title>

        {/* 告警状态 */}
        <div style={{ marginBottom: 8 }}>
          <AlarmBadge alarmType={device.alarmType} />
        </div>

        {/* 温度信息 */}
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FireOutlined style={{ color: '#1890ff' }} />
            <Text strong style={{ fontSize: 16 }}>
              {temperatureDisplay}
            </Text>
          </div>

          {/* 温度设置范围 */}
          <Text type="secondary" style={{ fontSize: 12 }}>
            设置: {device.minSettingTemp}°C ~ {device.maxSettingTemp}°C
          </Text>

          {/* 更新时间 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ClockCircleOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {updateTimeDisplay}
            </Text>
          </div>
        </Space>

        {/* 设备UUID（调试信息） */}
        {process.env.NODE_ENV === 'development' && (
          <Tooltip title={`UUID: ${device.deviceUuid}`}>
            <Text 
              type="secondary" 
              style={{ 
                fontSize: 10, 
                position: 'absolute', 
                bottom: 2, 
                right: 2,
                opacity: 0.5,
              }}
            >
              {device.deviceUuid.slice(-6)}
            </Text>
          </Tooltip>
        )}
      </div>
    </Card>
  );
});

export default DeviceCard;
