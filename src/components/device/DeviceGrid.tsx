/**
 * 设备网格组件
 * 展示设备列表，支持分页和多选
 */

import React from 'react';
import { Row, Col, Pagination, Empty, Spin } from 'antd';
import { DeviceItem } from '../../types/trough';
import { DeviceCard } from './DeviceCard';

export interface DeviceGridProps {
  /** 设备列表 */
  devices: DeviceItem[];
  /** 总数 */
  total: number;
  /** 当前页码 */
  pageNum: number;
  /** 每页大小 */
  pageSize: number;
  /** 加载状态 */
  loading?: boolean;
  /** 已选择的设备ID */
  selectedDeviceIds: number[];
  /** 设备选择切换回调 */
  onToggleDevice?: (deviceId: number) => void;
  /** 分页变更回调 */
  onPageChange?: (pageNum: number, pageSize: number) => void;
}

/**
 * 设备网格组件
 */
export const DeviceGrid = React.memo<DeviceGridProps>(function DeviceGrid({
  devices,
  total,
  pageNum,
  pageSize,
  loading = false,
  selectedDeviceIds,
  onToggleDevice,
  onPageChange,
}) {
  // 响应式列配置
  const colProps = {
    xs: 24,    // 超小屏：1列
    sm: 12,    // 小屏：2列
    md: 8,     // 中屏：3列
    lg: 6,     // 大屏：4列
    xl: 4,     // 超大屏：6列
    xxl: 3,    // 超超大屏：8列
  };

  // 渲染设备卡片
  const renderDeviceCard = (device: DeviceItem) => {
    const isSelected = selectedDeviceIds.includes(device.deviceId);
    
    return (
      <Col key={device.deviceId} {...colProps}>
        <DeviceCard
          device={device}
          selected={isSelected}
          onToggle={onToggleDevice}
          style={{ marginBottom: 16 }}
        />
      </Col>
    );
  };

  // 空状态处理
  if (!loading && devices.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Empty 
          description="暂无设备数据"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <Spin spinning={loading} tip="加载中...">
      <div>
        {/* 设备网格 */}
        <Row gutter={[16, 0]}>
          {devices.map(renderDeviceCard)}
        </Row>

        {/* 分页器 */}
        {total > 0 && (
          <div style={{ 
            marginTop: 24, 
            textAlign: 'center',
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16,
          }}>
            <Pagination
              current={pageNum}
              pageSize={pageSize}
              total={total}
              onChange={onPageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }
              pageSizeOptions={['10', '20', '50', '100']}
              disabled={loading}
            />
          </div>
        )}

        {/* 选择信息提示 */}
        {selectedDeviceIds.length > 0 && (
          <div style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#1890ff',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}>
            已选择 {selectedDeviceIds.length} 个设备
          </div>
        )}
      </div>
    </Spin>
  );
});

export default DeviceGrid;
