import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
