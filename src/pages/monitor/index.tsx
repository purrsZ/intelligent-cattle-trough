import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Input, Select, Space, message } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearSelected, fetchTroughList, setFilters, toggleSelect, updateTemperature } from '../../store/troughSlice';
import { TroughGrid } from '../../components/trough/TroughGrid';
import { TemperatureBatchModal } from '../../components/trough/TemperatureBatchModal';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';
import type { TroughStatus } from '../../types/trough';

/**
 * Monitor 页面：展示设备列表，支持多选与批量设置温度
 */
export function MonitorPage() {
  const dispatch = useAppDispatch();
  const { list, total, selectedIds, filters, loading } = useAppSelector((s) => s.trough);
  const [modalOpen, setModalOpen] = useState(false);
  const [keyword, setKeyword] = useState(filters.keyword || '');
  const [status, setStatus] = useState<TroughStatus | undefined>(filters.status);

  useEffect(() => {
    dispatch(fetchTroughList());
  }, [dispatch]);

  const onToggle = useCallback((id: string) => dispatch(toggleSelect(id)), [dispatch]);
  const onPageChange = useCallback(
    (page: number, pageSize: number) => {
      dispatch(setFilters({ page, pageSize }));
      dispatch(fetchTroughList({ page, pageSize }));
    },
    [dispatch]
  );

  const hasSelection = useMemo(() => selectedIds.length > 0, [selectedIds.length]);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleBatchSubmit = useCallback(
    async (values: { min: number; max: number }) => {
      try {
        await dispatch(
          updateTemperature({ troughIds: selectedIds, min: values.min, max: values.max })
        ).unwrap();
        message.success('设置成功');
        setModalOpen(false);
        dispatch(clearSelected());
        dispatch(fetchTroughList(filters));
      } catch (e) {
        message.error('设置失败');
      }
    },
    [dispatch, selectedIds, filters]
  );

  const debouncedSearch = useDebouncedCallback((kw: string) => {
    dispatch(setFilters({ keyword: kw, page: 1 }));
    dispatch(fetchTroughList({ keyword: kw, page: 1 }));
  }, 400);

  const onKeywordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const kw = e.target.value;
    setKeyword(kw);
    debouncedSearch(kw);
  }, [debouncedSearch]);

  const onStatusChange = useCallback((value: TroughStatus | undefined) => {
    setStatus(value);
    dispatch(setFilters({ status: value, page: 1 }));
    dispatch(fetchTroughList({ status: value, page: 1 }));
  }, [dispatch]);

  return (
    <Card
      title="饲槽监控"
      extra={
        <Space wrap size={8}>
          <Input
            placeholder="搜索名称"
            value={keyword}
            onChange={onKeywordChange}
            style={{ width: 200 }}
            allowClear
          />
          <Select<TroughStatus>
            placeholder="状态"
            allowClear
            value={status}
            onChange={onStatusChange}
            style={{ width: 120 }}
            options={[
              { label: '正常', value: 'normal' as TroughStatus },
              { label: '预警', value: 'warning' as TroughStatus },
              { label: '异常', value: 'error' as TroughStatus },
            ]}
          />
          <Button disabled={!hasSelection} onClick={openModal} type="primary">
            批量设置温度
          </Button>
          <Button disabled={!hasSelection} onClick={() => dispatch(clearSelected())}>
            清空选择
          </Button>
        </Space>
      }
    >
      <TroughGrid
        list={list}
        total={total}
        page={filters.page}
        pageSize={filters.pageSize}
        loading={loading}
        selectedIds={selectedIds}
        onToggle={onToggle}
        onPageChange={onPageChange}
      />

      <TemperatureBatchModal open={modalOpen} onClose={closeModal} onSubmit={handleBatchSubmit} />
    </Card>
  );
}

export default MonitorPage;


