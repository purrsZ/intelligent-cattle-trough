import React from 'react';
import { Button, Card, Form, Input } from 'antd';

/**
 * 登录页占位
 */
export function LoginPage() {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    // TODO: 调用登录接口，保存 token
  };

  return (
    <Card title="登录" style={{ maxWidth: 360, margin: '20vh auto' }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          登录
        </Button>
      </Form>
    </Card>
  );
}

export default LoginPage;


