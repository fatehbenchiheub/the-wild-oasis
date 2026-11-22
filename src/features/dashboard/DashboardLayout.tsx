import styled from 'styled-components';
import { useRecentBookings } from './useRecentBookings';
import Spinner from '../../ui/Spinner';
import { useRecentStays } from './useRecentStays';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { isPending: isPendingBookings, bookings } = useRecentBookings();
  const { isPending: isPendingStays, stays, confirmedStays } = useRecentStays();

  if (isPendingBookings || isPendingStays) return <Spinner />;
  return <StyledDashboardLayout></StyledDashboardLayout>;
}

export default DashboardLayout;
