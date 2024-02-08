import { configureStore } from '@reduxjs/toolkit';
import { authApi,notification,projectApi,storage,suggestionApi } from 'services/services';

import { handleError } from './middlewares/middlewares';
import { rootReducer } from './root-reducer';

const extraArgument = {
  storage,
  notification,
  authApi: authApi,
  projectApi,
  suggestionApi,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      thunk: { extraArgument },
    }).concat([handleError]);
  },
});

export { extraArgument, store };
