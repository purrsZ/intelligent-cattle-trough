/**
 * 总览页面
 * 显示系统整体概况和统计信息
 */

import React from 'react';
import { Card, Row, Col, Statistic, Empty } from 'antd';
import { 
  DatabaseOutlined, 
  AlertOutlined, 
  CheckCircleOutlined, 
  ThunderboltOutlined 
} from '@ant-design/icons';

/**
 * 总览页面组件
 */
export function OverviewPage() {
  return (
    <div style={{ padding: '0 24px' }}>
      <Row gutter={[24, 24]}>
        {/* 统计卡片 */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={0}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="告警设备"
              value={0}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃设备"
              value={0}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="设备状态分布" style={{ height: 400 }}>
            <div style={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Empty 
                description="图表功能开发中..."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="温度趋势" style={{ height: 400 }}>
            <div style={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Empty 
                description="图表功能开发中..."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 最近告警 */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="最近告警" style={{ height: 400 }}>
            <div style={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Empty 
                description="暂无告警数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OverviewPage;
