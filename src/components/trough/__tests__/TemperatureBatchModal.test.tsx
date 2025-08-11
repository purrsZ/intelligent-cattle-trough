import React from 'react';
import { render, screen } from '@testing-library/react';
import * as userEvent from '@testing-library/user-event';
import { TemperatureBatchModal } from '../TemperatureBatchModal';

describe('TemperatureBatchModal', () => {
  test('校验 min < max', async () => {
    const onSubmit = jest.fn();
    const onClose = jest.fn();
    render(<TemperatureBatchModal open onClose={onClose} onSubmit={onSubmit} />);

    const user = userEvent.default ? userEvent.default.setup() : (userEvent as any).setup();
    const inputs = screen.getAllByRole('spinbutton');
    // min
    await user.clear(inputs[0]);
    await user.type(inputs[0], '10');
    // max
    await user.clear(inputs[1]);
    await user.type(inputs[1], '5');

    await user.click(screen.getByRole('button', { name: '确认' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findAllByText(/最小温度需小于最大温度|最大温度需大于最小温度/)).toHaveLength(2);
  });
});


