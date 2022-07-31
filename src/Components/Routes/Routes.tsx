import { Route, Routes as ParentRoute } from 'react-router-dom';
import { Login } from '../../Containers/Login/Login';
import App from '../../App';

function Routes() {

  function checkLogin() {
  }

  return (
    <ParentRoute>
      <Route path={'/login'} element={<Login />} />
    </ParentRoute>
  );
}

export { Routes };