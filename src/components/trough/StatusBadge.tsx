import React from 'react';
import { Tag } from 'antd';
import { TroughStatus } from '../../types/trough';

export interface StatusBadgeProps {
  status: TroughStatus;
}

/**
 * 状态徽标：根据设备状态展示不同颜色与文案
 * - normal: 绿色
 * - warning: 橙色
 * - error: 红色
 */
export const StatusBadge = React.memo(function StatusBadge({ status }: StatusBadgeProps) {
  const color = status === 'normal' ? 'green' : status === 'warning' ? 'orange' : 'red';
  const text = status === 'normal' ? '正常' : status === 'warning' ? '预警' : '异常';
  return <Tag color={color}>{text}</Tag>;
});

export default StatusBadge;


