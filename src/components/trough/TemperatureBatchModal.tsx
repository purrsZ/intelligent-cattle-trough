import React, { useCallback } from 'react';
import { Button, Form, InputNumber, Modal } from 'antd';

export interface TemperatureBatchModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { min: number; max: number }) => void;
}

/**
 * 批量温度设置弹窗：校验 min < max
 */
export const TemperatureBatchModal = React.memo(function TemperatureBatchModal({ open, onClose, onSubmit }: TemperatureBatchModalProps) {
  const [form] = Form.useForm<{ min: number; max: number }>();

  const handleOk = useCallback(async () => {
    const values = await form.validateFields();
    if (values.min >= values.max) {
      form.setFields([
        { name: 'min', errors: ['最小温度需小于最大温度'] },
        { name: 'max', errors: ['最大温度需大于最小温度'] },
      ]);
      return;
    }
    onSubmit(values);
  }, [form, onSubmit]);

  return (
    <Modal
      title="批量设置温度"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose={false}
      destroyOnHidden
      getContainer={() => document.body}
    >
      <Form form={form} layout="vertical" initialValues={{ min: 0, max: 10 }}>
        <Form.Item name="min" label="最小温度" rules={[{ required: true }]}>
          <InputNumber min={-50} max={80} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="max" label="最大温度" rules={[{ required: true }]}>
          <InputNumber min={-50} max={80} style={{ width: '100%' }} />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleOk}>
            确认
          </Button>
        </div>
      </Form>
    </Modal>
  );
});

export default TemperatureBatchModal;


