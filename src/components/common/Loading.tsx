import React from 'react';
import { Spin } from 'antd';

export interface LoadingProps {
  tip?: string;
}

/**
 * 通用 Loading 组件
 */
export const Loading = React.memo(function Loading({ tip }: LoadingProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <Spin tip={tip} />
    </div>
  );
});

export default Loading;


