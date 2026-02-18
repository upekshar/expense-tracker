import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createOfflineMiddleware } from './offlineMiddleware';
import { setSyncing, setSyncDone } from '../slices/syncSlice';
import { clearQueue } from '../slices/expenseSlice';
import { queryClient } from '../../api/queryClient';

vi.mock('../../api/queryClient');

describe('offlineMiddleware', () => {
  let middleware: any;
  let store: any;
  let next: any;
  let fetchMock: any;

  beforeEach(() => {
    middleware = createOfflineMiddleware();
    next = vi.fn((action) => action);
    store = {
      getState: vi.fn(),
      dispatch: vi.fn(),
    };
    fetchMock = vi.fn();
    global.fetch = fetchMock;
    vi.stubGlobal('navigator', { onLine: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should pass through non-sync actions', async () => {
    const action = { type: 'someOtherAction' };
    const handler = middleware(store)(next);
    await handler(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should return early when offline', async () => {
    vi.stubGlobal('navigator', { onLine: false });
    store.getState.mockReturnValue({
      expenses: { offlineQueue: [{ type: 'add', payload: {} }] },
    });
    const action = { type: 'sync/triggerSync' };
    const handler = middleware(store)(next);
    await handler(action);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should return early when queue is empty', async () => {
    store.getState.mockReturnValue({
      expenses: { offlineQueue: [] },
    });
    const action = { type: 'sync/triggerSync' };
    const handler = middleware(store)(next);
    await handler(action);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should handle add action successfully', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });
    const expense = { id: '1', amount: 100, description: 'test' };
    store.getState.mockReturnValue({
      expenses: { offlineQueue: [{ type: 'add', payload: expense }] },
    });
    const action = { type: 'sync/triggerSync' };
    const handler = middleware(store)(next);
    await handler(action);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/expenses'), {
      method: 'POST',
      headers: expect.any(Object),
      body: JSON.stringify(expense),
    });
    expect(store.dispatch).toHaveBeenCalledWith(setSyncing());
    expect(store.dispatch).toHaveBeenCalledWith(clearQueue());
  });

  it('should handle update action successfully', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });
    const expense = { id: '1', amount: 200, description: 'updated' };
    store.getState.mockReturnValue({
      expenses: { offlineQueue: [{ type: 'update', payload: expense }] },
    });
    const action = { type: 'sync/triggerSync' };
    const handler = middleware(store)(next);
    await handler(action);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/expenses/1'), {
      method: 'PUT',
      headers: expect.any(Object),
      body: JSON.stringify(expense),
    });
  });

  it('should handle delete action successfully', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });
    store.getState.mockReturnValue({
      expenses: { offlineQueue: [{ type: 'delete', payload: '1' }] },
    });
    const action = { type: 'sync/triggerSync' };
    const handler = middleware(store)(next);
    await handler(action);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/expenses/1'), {
      method: 'DELETE',
      headers: expect.any(Object),
    });
  });

  it('should stop syncing on fetch error', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));
    store.getState.mockReturnValue({
      expenses: { offlineQueue: [{ type: 'add', payload: { id: '1' } }] },
    });
    const action = { type: 'sync/triggerSync' };
    const handler = middleware(store)(next);
    await handler(action);
    expect(store.dispatch).toHaveBeenCalledWith(setSyncing());
    expect(store.dispatch).not.toHaveBeenCalledWith(clearQueue());
    expect(store.dispatch).toHaveBeenCalledWith(setSyncDone());
  });

  it('should invalidate queries on successful sync', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });
    store.getState.mockReturnValue({
      expenses: { offlineQueue: [{ type: 'add', payload: { id: '1' } }] },
    });
    const action = { type: 'sync/triggerSync' };
    const handler = middleware(store)(next);
    await handler(action);
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['expenses'] });
  });
});