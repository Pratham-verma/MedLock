import { configureStore } from '@reduxjs/toolkit';
import { provider } from "./reducer";

const customSerializableCheck = {
  isSerializable: (value) => {
    if (typeof value === 'bigint') {
      return true; // Consider BigInt as serializable
    }
    return true; // Consider everything serializable for now
  },
  getEntries: (value) => {
    return Object.entries(value);
  },
};

const store = configureStore({
  reducer: {
    provider
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ...customSerializableCheck,
      },
    }),
  devTools: {
    serialize: {
      options: {
        map: (value) => {
          if (typeof value === 'bigint') {
            return value.toString();
          }
          return value;
        },
      },
    },
  },
});

export default store;