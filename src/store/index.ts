import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './deviceSlice';

/**
 * 全局 Redux Store
 * - 集中注册各 Slice 的 reducer
 * - 暴露类型与 hooks 辅助
 */
export const store = configureStore({
  reducer: {
    device: deviceReducer,
  },
  // 如需自定义中间件：middleware: (getDefault) => getDefault().concat(customMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


