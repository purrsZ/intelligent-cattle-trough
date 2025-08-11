import React, { useCallback } from 'react';
import { Card, Checkbox } from 'antd';
import classNames from 'classnames';
import { Trough } from '../../types/trough';
import { StatusBadge } from './StatusBadge';

export interface TroughCardProps {
  data: Trough;
  checked: boolean;
  onToggle: (id: string) => void;
}

/**
 * 设备卡片：展示名称/温度/状态，并支持选择
 */
export const TroughCard = React.memo(function TroughCard({ data, checked, onToggle }: TroughCardProps) {
  const handleChange = useCallback(() => onToggle(data.id), [onToggle, data.id]);

  return (
    <Card
      size="small"
      className={classNames('trough-card', { checked })}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox checked={checked} onChange={handleChange} />
          <span>{data.name}</span>
        </div>
      }
      extra={<StatusBadge status={data.status} />}
    >
      <div>当前温度：{data.currentTemperature}℃</div>
    </Card>
  );
});

export default TroughCard;


