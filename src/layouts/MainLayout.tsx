import React, { PropsWithChildren } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  MonitorOutlined,
  AppstoreOutlined 
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

/**
 * 导航菜单项配置
 */
const menuItems = [
  {
    key: '/overview',
    icon: <DashboardOutlined />,
    label: '总览',
  },
  {
    key: '/monitor',
    icon: <MonitorOutlined />,
    label: '设备列表',
  },
];

/**
 * 主布局：侧栏 + 顶部 + 内容
 */
export function MainLayout({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        width={200} 
        theme="light"
        style={{
          boxShadow: '2px 0 6px rgba(0,21,41,.35)',
        }}
      >
        {/* Logo区域 */}
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 16px'
        }}>
          <AppstoreOutlined style={{ fontSize: 24, color: '#1677ff', marginRight: 8 }} />
          <Title level={5} style={{ margin: 0, color: '#1677ff' }}>
            智能水槽
          </Title>
        </div>

        {/* 导航菜单 */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, paddingTop: 16 }}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Title level={4} style={{ margin: 0, color: '#262626' }}>
            Intelligent Cattle Trough
          </Title>
        </Header>
        <Content style={{ margin: 16, overflow: 'auto' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;


