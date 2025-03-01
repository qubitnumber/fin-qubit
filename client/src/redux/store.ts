import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { kpiApi } from "@/redux/api/kpiApi";
import { authApi } from "@/redux/api/authApi";
import { userApi } from "@/redux/api/userApi";
import userReducer from './features/userSlice';

export const store = configureStore({
  reducer: {
    [kpiApi.reducerPath]: kpiApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    userState: userReducer,
  },
  devTools: import.meta.env.VITE_NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([
    kpiApi.middleware,
    authApi.middleware,
    userApi.middleware
  ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

setupListeners(store.dispatch);