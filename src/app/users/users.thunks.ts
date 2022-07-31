import { createAsyncThunk } from '@reduxjs/toolkit';
export const getAllUsers = createAsyncThunk('/users/getAll', async () => {});
