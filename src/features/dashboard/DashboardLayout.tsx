import styled from 'styled-components';
import { useRecentBookings } from './useRecentBookings';
import Spinner from '../../ui/Spinner';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { isPending, bookings } = useRecentBookings();

  if (isPending) return <Spinner />;
  return <StyledDashboardLayout></StyledDashboardLayout>;
}

export default DashboardLayout;
