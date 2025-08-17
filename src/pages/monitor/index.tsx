/**
 * 设备监控页面
 * 使用新的API接口和数据结构
 */

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Button, Card, Input, Select, Space, App } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchDevices,
  fetchDeviceGroups,
  batchUpdateDeviceConfig,
  setFilters,
  clearSelection,
  toggleDeviceSelection,
  clearError,
} from '../../store/deviceSlice';
import { DeviceGrid } from '../../components/device/DeviceGrid';
import { TemperatureBatchModal } from '../../components/device/TemperatureBatchModal';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';
import {
  AlarmType,
  AlarmTypeLabels,
  PAGINATION,
} from '../../types/trough';

/**
 * 设备监控页面组件
 */
export function MonitorPage() {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const {
    devices,
    deviceGroups,
    total,
    selectedDeviceIds,
    filters,
    loading,
    error,
  } = useAppSelector((state) => state.device);

  const [modalOpen, setModalOpen] = useState(false);
  const [deviceNameInput, setDeviceNameInput] = useState(filters.deviceName || '');
  const [selectedAlarmType, setSelectedAlarmType] = useState<AlarmType | undefined>(filters.alarmType);
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(filters.groupId);

  // 初始化数据
  useEffect(() => {
    console.log('🚀 初始化数据加载');
    dispatch(fetchDevices());
    dispatch(fetchDeviceGroups()); // 恢复设备组加载
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在组件挂载时执行一次

  // 当需要设备组数据时才加载（比如用户点击筛选）
  const loadDeviceGroupsIfNeeded = useCallback(() => {
    if (deviceGroups.length === 0) {
      dispatch(fetchDeviceGroups());
    }
  }, [deviceGroups.length, dispatch]);

  // 调试数据状态
  useEffect(() => {
    console.log('📊 数据状态更新:', { 
      devices: devices.length, 
      deviceGroups: deviceGroups.length, 
      total, 
      loading, 
      error 
    });
  }, [devices, deviceGroups, total, loading, error]);

  // 错误处理
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch, message]);

  // 计算是否有选择
  const hasSelection = useMemo(() => selectedDeviceIds.length > 0, [selectedDeviceIds.length]);

  // 设备选择切换
  const onToggleDevice = useCallback(
    (deviceId: number) => {
      dispatch(toggleDeviceSelection(deviceId));
    },
    [dispatch]
  );

  // 分页变更
  const onPageChange = useCallback(
    (pageNum: number, pageSize: number) => {
      const newFilters = { ...filters, pageNum, pageSize };
      dispatch(setFilters(newFilters));
      dispatch(fetchDevices(newFilters));
    },
    [dispatch, filters]
  );

  // 防抖搜索
  const debouncedSearch = useDebouncedCallback((deviceName: string) => {
    const newFilters = { ...filters, deviceName, pageNum: PAGINATION.DEFAULT_PAGE_NUM };
    dispatch(setFilters(newFilters));
    dispatch(fetchDevices(newFilters));
  }, 400);

  // 设备名称搜索
  const onDeviceNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setDeviceNameInput(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // 告警状态筛选
  const onAlarmTypeChange = useCallback(
    (value: AlarmType | undefined) => {
      setSelectedAlarmType(value);
      const newFilters = { ...filters, alarmType: value, pageNum: PAGINATION.DEFAULT_PAGE_NUM };
      dispatch(setFilters(newFilters));
      dispatch(fetchDevices(newFilters));
    },
    [dispatch, filters]
  );

  // 设备组筛选
  const onGroupIdChange = useCallback(
    (value: number | undefined) => {
      setSelectedGroupId(value);
      const newFilters = { ...filters, groupId: value, pageNum: PAGINATION.DEFAULT_PAGE_NUM };
      dispatch(setFilters(newFilters));
      dispatch(fetchDevices(newFilters));
    },
    [dispatch, filters]
  );

  // 打开批量设置弹窗
  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  // 关闭批量设置弹窗
  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  // 批量设置温度提交
  const handleBatchSubmit = useCallback(
    async (values: { min: number; max: number }) => {
      try {
        await dispatch(
          batchUpdateDeviceConfig({
            deviceIds: selectedDeviceIds,
            minTemp: values.min,
            maxTemp: values.max,
          })
        ).unwrap();

        message.success(`成功更新 ${selectedDeviceIds.length} 个设备的温度配置`);
        setModalOpen(false);
        
        // 刷新设备列表
        dispatch(fetchDevices(filters));
      } catch (error: any) {
        message.error(error || '设置失败');
      }
    },
    [dispatch, selectedDeviceIds, filters, message]
  );

  // 清空选择
  const handleClearSelection = useCallback(() => {
    dispatch(clearSelection());
  }, [dispatch]);

  return (
    <Card
      title="设备监控"
      extra={
        <Space wrap size={8}>
          <Input
            placeholder="搜索设备名称"
            value={deviceNameInput}
            onChange={onDeviceNameChange}
            style={{ width: 200 }}
            allowClear
          />
          
          <Select<AlarmType>
            placeholder="告警状态"
            allowClear
            value={selectedAlarmType}
            onChange={onAlarmTypeChange}
            style={{ width: 120 }}
            options={Object.entries(AlarmTypeLabels).map(([key, label]) => ({
              label,
              value: Number(key) as AlarmType,
            }))}
          />

          <Select<number>
            placeholder="设备组"
            allowClear
            value={selectedGroupId}
            onChange={onGroupIdChange}
            onFocus={loadDeviceGroupsIfNeeded} // 点击时才加载设备组
            style={{ width: 120 }}
            options={deviceGroups.map((group) => ({
              label: group.groupName,
              value: group.groupId,
            }))}
          />

          <Button 
            disabled={!hasSelection} 
            onClick={openModal} 
            type="primary"
          >
            批量设置温度 ({selectedDeviceIds.length})
          </Button>

          <Button 
            disabled={!hasSelection} 
            onClick={handleClearSelection}
          >
            清空选择
          </Button>
        </Space>
      }
    >
      <DeviceGrid
        devices={devices}
        total={total}
        pageNum={filters.pageNum}
        pageSize={filters.pageSize}
        loading={loading}
        selectedDeviceIds={selectedDeviceIds}
        onToggleDevice={onToggleDevice}
        onPageChange={onPageChange}
      />

      <TemperatureBatchModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleBatchSubmit}
        selectedCount={selectedDeviceIds.length}
      />
    </Card>
  );
}

export default MonitorPage;