import { User } from '../users/users.types';

export type AuthState = {
  user: User,
  authToken: string;
};

export type LoginParams = {
  email: string;
  password: string;
}