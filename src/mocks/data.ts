import { Trough, TroughStatus } from '../types/trough';

const statuses: TroughStatus[] = ['normal', 'warning', 'error'];

function createItem(i: number): Trough {
  const status = statuses[i % statuses.length];
  return {
    id: String(i + 1),
    name: `饲槽-${i + 1}`,
    currentTemperature: Math.round((Math.random() * 25 + 5) * 10) / 10,
    status,
    updatedAt: new Date().toISOString(),
  };
}

export const troughDataset: Trough[] = Array.from({ length: 57 }).map((_, i) => createItem(i));


