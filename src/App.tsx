import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

import { GlobalStyle } from './styles/globalStyles';

import Bookings from './pages/Bookings';
import Cabins from './pages/Cabins';
// import { LogIn, Settings, Users } from 'lucide-react';
import Account from './pages/Account';
import PageNotFound from './pages/PageNotFound';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Login from './pages/Login';
import AppLayout from './ui/layouts/AppLayout';

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />

          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/cabins" element={<Cabins />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
