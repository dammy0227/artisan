// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import adminReducer from "../features/admin/adminSlice";
import artisanReducer from "../features/artisan/artisanSlice";
import studentReducer from "../features/student/studentSlice";
import bookingReducer from "../features/booking/bookingSlice";
import reviewReducer from "../features/review/reviewSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["admin", "artisan", "student"], // ✅ Persist only auth slices
};

const rootReducer = {
  admin: adminReducer,
  artisan: artisanReducer,
  student: studentReducer,
  booking: bookingReducer,
  review: reviewReducer,
};

const persistedReducer = persistReducer(persistConfig, (state, action) => {
  let newState = {};
  for (const key in rootReducer) {
    newState[key] = rootReducer[key](state ? state[key] : undefined, action);
  }
  return newState;
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
