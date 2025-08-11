import React, { useCallback, useMemo } from 'react';
import { Pagination } from 'antd';
import { Loading } from '../common/Loading';
import { Empty } from '../common/Empty';
import { Trough } from '../../types/trough';
import { TroughCard } from './TroughCard';

export interface TroughGridProps {
  list: Trough[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  selectedIds: string[];
  onToggle: (id: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
}

/**
 * 设备网格容器：分页渲染卡片
 */
export const TroughGrid = React.memo(function TroughGrid(props: TroughGridProps) {
  const { list, total, page, pageSize, loading, selectedIds, onToggle, onPageChange } = props;

  const gridTemplate = useMemo(() => {
    return {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 12,
      marginBottom: 16,
    } as const;
  }, []);

  const handlePageChange = useCallback((p: number, ps: number) => onPageChange(p, ps), [onPageChange]);

  if (loading) return <Loading tip="加载中" />;
  if (!list.length) return <Empty description="暂无数据" />;

  return (
    <div>
      <div style={gridTemplate}>
        {list.map((item) => (
          <TroughCard key={item.id} data={item} checked={selectedIds.includes(item.id)} onToggle={onToggle} />
        ))}
      </div>
      <Pagination current={page} pageSize={pageSize} total={total} onChange={handlePageChange} size="small" />
    </div>
  );
});

export default TroughGrid;


