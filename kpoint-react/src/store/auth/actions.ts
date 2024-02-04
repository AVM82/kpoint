import { createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from 'common/types/app/async-thunk-config.type';

import { ResponseType } from '../../common/types/response/response';
import { SignInType } from '../../common/types/sign-in/sign-in';
import { SignUpType } from '../../common/types/sign-up/sign-up';
import { ActionType } from './common';

const login = createAsyncThunk<ResponseType, SignInType, AsyncThunkConfig>(
  ActionType.LOGIN,
  async (payload, { extra }) => {
    const { authApi } = extra;

    return authApi.login(payload);
  },
);

const register = createAsyncThunk<string, SignUpType, AsyncThunkConfig>(
  ActionType.REGISTER,
  async (payload, { extra }) => {
    const { authApi } = extra;

    return authApi.register(payload);
  },
);

export { login, register };
