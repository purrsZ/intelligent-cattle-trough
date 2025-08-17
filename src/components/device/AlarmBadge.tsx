/**
 * 告警状态徽标组件
 * 根据设备告警状态展示不同颜色与文案
 */

import React from 'react';
import { Tag } from 'antd';
import { AlarmType } from '../../types/trough';
import { getAlarmTypeLabel, getAlarmTypeColor } from '../../api';

export interface AlarmBadgeProps {
  /** 告警类型 */
  alarmType: AlarmType;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/**
 * 告警状态徽标组件
 */
export const AlarmBadge = React.memo<AlarmBadgeProps>(function AlarmBadge({ 
  alarmType, 
  style 
}) {
  const label = getAlarmTypeLabel(alarmType);
  const color = getAlarmTypeColor(alarmType);

  return (
    <Tag 
      color={color} 
      style={style}
    >
      {label}
    </Tag>
  );
});

export default AlarmBadge;
