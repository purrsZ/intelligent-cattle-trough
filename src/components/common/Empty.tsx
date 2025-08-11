import React from 'react';
import { Empty as AntdEmpty } from 'antd';

export interface EmptyProps {
  description?: string;
}

/**
 * 通用 Empty 组件
 */
export const Empty = React.memo(function Empty({ description }: EmptyProps) {
  return (
    <div style={{ padding: 24 }}>
      <AntdEmpty description={description} />
    </div>
  );
});

export default Empty;


