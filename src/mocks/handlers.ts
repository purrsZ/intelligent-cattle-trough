import { http, HttpResponse } from 'msw';
import { troughDataset } from './data';
import { TemperatureUpdatePayload, Trough, TroughListResponse } from '../types/trough';

export const handlers = [
  // GET /api/troughs
  http.get('/api/troughs', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 12);
    const keyword = url.searchParams.get('keyword') || '';
    const status = url.searchParams.get('status');

    let list: Trough[] = troughDataset;
    if (keyword) list = list.filter((x) => x.name.includes(keyword));
    if (status) list = list.filter((x) => x.status === status);

    const start = (page - 1) * pageSize;
    const pageList = list.slice(start, start + pageSize);

    const data: TroughListResponse = { list: pageList, total: list.length };
    return HttpResponse.json(data);
  }),

  // POST /api/troughs/temperature
  http.post('/api/troughs/temperature', async ({ request }) => {
    const body = (await request.json()) as TemperatureUpdatePayload;
    if (!body || !Array.isArray(body.troughIds) || body.troughIds.length === 0) {
      return new HttpResponse('Invalid payload', { status: 400 });
    }
    // 简单模拟成功
    return HttpResponse.json({ success: true });
  }),
];


