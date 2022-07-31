import decode from 'jwt-decode';
import { User, UserRole } from '../app/users/users.types';
import { history } from '../app/history';

interface AuthToken {
  id: number;
  email: string;
  role: UserRole;
  expiry: number;
}

interface AuthService {
  getCurrentUser: () => Partial<User> | undefined,
  getDecodedToken: () => AuthToken | undefined,
  getToken: () => string | null,
  logout: () => void;
  setLogin: (token: string) => void;
  isAdminUser: () => boolean;
  isAuthenticated: () => boolean;
}

export const AuthorizationService: AuthService = {
  isAdminUser: () => {
    const user = AuthorizationService.getCurrentUser();
    if (!user) {
      return false;
    }
    return user.role === UserRole.ADMIN;
  },
  // This should be deprecated, The currentUser should be gotten from the redux store
  getCurrentUser: () => {
    const tokenInfo = AuthorizationService.getDecodedToken();
    if (!tokenInfo)
      return;

    const { id, email, role } = tokenInfo;
    return { id, email, role };
  },

  getDecodedToken: () => {
    const token = AuthorizationService.getToken();
    if (!token)
      return;

    return decode(token);
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('hideSalesForceAuthAlert');
    history.push('/signin');
  },

  setLogin: (token) => {
    localStorage.setItem('token', token);
  },

  isAuthenticated: () => {
    const tokenInfo = AuthorizationService.getDecodedToken();
    if (tokenInfo) {
      const dateNow: number = new Date().getTime() / 1000;
      if (tokenInfo.expiry - dateNow > 20) {
        // if less than 20 seconds left in expiry, have to login again
        return true;
      }
    }
    return false;
  },
};
