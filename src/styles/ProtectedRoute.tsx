import styled from 'styled-components';
import { useUser } from '../features/authentication/useUser';
import Spinner from '../ui/Spinner';
import { useNavigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

// type AppLayoutProps = React.PropsWithChildren;
type ProtectedRouteProps = {
  children: ReactNode;
};
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  // 1- Load authenticated User
  const { isPending, isAuthenticated } = useUser();

  // 2- If there is NO Authenticated User, redirect to '/login'
  useEffect(
    function () {
      if (!isAuthenticated && !isPending) navigate('/login');
    },
    [navigate, isAuthenticated, isPending]
  );

  // 3- While loading, Show a Spinner
  if (isPending)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4- f there is a User, render the app and redirect to '/dashboard'
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
