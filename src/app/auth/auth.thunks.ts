import { createAsyncThunk } from '@reduxjs/toolkit';
import { RequestService } from '../../Services/RequestService';

export const doLogin = createAsyncThunk('auth/doLogin', async () => {
  const response = await RequestService.post('/auth/login', {});
  if (!response)
    return;
  return response;
});