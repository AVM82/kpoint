import { createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from 'common/types/app/async-thunk-config.type';
import { NotificationPayload } from 'common/types/notification/notification-payload.type';

import { ActionType } from './common';

const notify = createAsyncThunk<void, NotificationPayload, AsyncThunkConfig>(
  ActionType.NOTIFY,
  (payload, { extra }) => {
    const { notification } = extra;
    const { type, message } = payload;

    return notification[type](message);
  },
);

export { notify };
