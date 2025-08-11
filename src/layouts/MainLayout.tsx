import React, { PropsWithChildren } from 'react';
import { Layout } from 'antd';

const { Header, Sider, Content } = Layout;

/**
 * 主布局：侧栏 + 顶部 + 内容
 */
export function MainLayout({ children }: PropsWithChildren) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light" />
      <Layout>
        <Header style={{ background: '#fff' }}>Intelligent Cattle Trough</Header>
        <Content style={{ margin: 16 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;


