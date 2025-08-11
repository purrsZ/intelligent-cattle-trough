import React from 'react';
import { render, screen } from '@testing-library/react';
import * as userEvent from '@testing-library/user-event';
import { TroughCard } from '../TroughCard';
import type { Trough } from '../../../types/trough';

describe('TroughCard', () => {
  const trough: Trough = {
    id: '1',
    name: '饲槽-1',
    currentTemperature: 10,
    status: 'normal',
    updatedAt: new Date().toISOString(),
  };

  test('渲染名称/温度/状态', () => {
    render(<TroughCard data={trough} checked={false} onToggle={jest.fn()} />);
    expect(screen.getByText('饲槽-1')).toBeInTheDocument();
    expect(screen.getByText(/当前温度：10℃/)).toBeInTheDocument();
    expect(screen.getByText('正常')).toBeInTheDocument();
  });

  test('点击勾选触发 onToggle', async () => {
    const onToggle = jest.fn();
    render(<TroughCard data={trough} checked={false} onToggle={onToggle} />);
    const user = userEvent.default ? userEvent.default.setup() : (userEvent as any).setup();
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith('1');
  });
});


