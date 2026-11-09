import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <>
      <div>The App Layout Is Here!</div>;
      <Outlet />;
    </>
  );
}

export default AppLayout;
