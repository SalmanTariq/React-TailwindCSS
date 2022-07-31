import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { AuthReducer } from './auth';

const rootReducer = combineReducers({
  authReducer: AuthReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export { store };
