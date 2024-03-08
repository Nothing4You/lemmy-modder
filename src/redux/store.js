import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistStore,
} from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query";

import accountReducer from "./reducer/accountReducer";
import configReducer from "./reducer/configReducer";


export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    accountReducer,
    configReducer
  },
  middleware: (getDefaultMiddleware) => 
   getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);
