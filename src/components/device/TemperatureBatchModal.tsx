/**
 * 批量温度设置弹窗组件
 * 用于批量设置多个设备的温度范围
 */

import React from 'react';
import { Modal, Form, InputNumber, Space, Typography } from 'antd';
import { FireOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface TemperatureBatchModalProps {
  /** 弹窗开启状态 */
  open: boolean;
  /** 关闭弹窗回调 */
  onClose: () => void;
  /** 提交回调 */
  onSubmit: (values: { min: number; max: number }) => void;
  /** 选中的设备数量 */
  selectedCount: number;
  /** 确认按钮加载状态 */
  loading?: boolean;
}

interface FormValues {
  min: number;
  max: number;
}

/**
 * 批量温度设置弹窗组件
 */
export const TemperatureBatchModal = React.memo<TemperatureBatchModalProps>(
  function TemperatureBatchModal({
    open,
    onClose,
    onSubmit,
    selectedCount,
    loading = false,
  }) {
    const [form] = Form.useForm<FormValues>();

    // 处理表单提交
    const handleSubmit = async () => {
      try {
        const values = await form.validateFields();
        onSubmit(values);
      } catch (error) {
        console.error('表单验证失败:', error);
      }
    };

    // 处理弹窗关闭
    const handleCancel = () => {
      form.resetFields();
      onClose();
    };

    // 表单验证规则
    const validateTemperatureRange = (_: any, value: number) => {
      const otherField = form.getFieldValue(_ === 'min' ? 'max' : 'min');
      
      if (value !== undefined && otherField !== undefined) {
        if (_ === 'min' && value >= otherField) {
          return Promise.reject(new Error('最低温度必须小于最高温度'));
        }
        if (_ === 'max' && value <= otherField) {
          return Promise.reject(new Error('最高温度必须大于最低温度'));
        }
      }
      
      return Promise.resolve();
    };

    return (
      <Modal
        title={
          <Space>
            <FireOutlined />
            <span>批量设置温度</span>
          </Space>
        }
        open={open}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="确定设置"
        cancelText="取消"
        width={480}
        destroyOnHidden
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            将为选中的 <Text strong>{selectedCount}</Text> 个设备设置温度范围
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{ min: 10, max: 25 }}
          autoComplete="off"
        >
          <Form.Item
            label="最低温度 (°C)"
            name="min"
            rules={[
              { required: true, message: '请输入最低温度' },
              { type: 'number', min: -50, max: 100, message: '温度范围应在 -50°C 到 100°C 之间' },
              { validator: (_, value) => validateTemperatureRange('min', value) },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入最低温度"
              precision={1}
              min={-50}
              max={100}
              addonAfter="°C"
            />
          </Form.Item>

          <Form.Item
            label="最高温度 (°C)"
            name="max"
            rules={[
              { required: true, message: '请输入最高温度' },
              { type: 'number', min: -50, max: 100, message: '温度范围应在 -50°C 到 100°C 之间' },
              { validator: (_, value) => validateTemperatureRange('max', value) },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入最高温度"
              precision={1}
              min={-50}
              max={100}
              addonAfter="°C"
            />
          </Form.Item>
        </Form>

        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          backgroundColor: '#f6ffed', 
          borderRadius: 6,
          border: '1px solid #b7eb8f',
        }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            💡 提示：设置完成后，所选设备将按照新的温度范围进行监控和告警
          </Text>
        </div>
      </Modal>
    );
  }
);

export default TemperatureBatchModal;
