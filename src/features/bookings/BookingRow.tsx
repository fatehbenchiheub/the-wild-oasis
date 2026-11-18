import styled from 'styled-components';
import { format, isToday } from 'date-fns';

import Tag from '../../ui/Tag';
import Table from '../../ui/Table';
import { type Booking } from './BookingDataBox';

import { formatCurrency, formatDistanceFromNow } from '../../utils/helpers';
import Menus from '../../ui/Menus';
import { HiEye } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
`;

interface BookingRowProps {
  booking: Booking;
}

const statusToTagName: Record<string, 'blue' | 'green' | 'silver'> = {
  unconfirmed: 'blue',
  'checked-in': 'green',
  'checked-out': 'silver',
};

function BookingRow({ booking }: BookingRowProps) {
  const navigate = useNavigate();
  // Safely extract properties with fallback values to prevent crashes
  const {
    id: bookingId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    status = 'unconfirmed',
    guests,
    cabins,
  } = booking || {};

  const guestName = guests?.fullName || 'Unknown Guest';
  const email = guests?.email || '';
  const cabinName = cabins?.name || 'Unknown Cabin';

  return (
    <Table.Row>
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {startDate && isToday(new Date(startDate))
            ? 'Today'
            : startDate
              ? formatDistanceFromNow(startDate)
              : ''}{' '}
          &rarr; {numNights ?? 0} night stay
        </span>
        <span>
          {startDate ? format(new Date(startDate), 'MMM dd yyyy') : ''} &mdash;{' '}
          {endDate ? format(new Date(endDate), 'MMM dd yyyy') : ''}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status] || 'silver'}>
        {status ? status.replace('-', ' ') : 'Unknown'}
      </Tag>

      <Amount>{formatCurrency(totalPrice ?? 0)}</Amount>

      <Menus.Menu>
        <Menus.Toggle id={bookingId} />
        <Menus.List id={bookingId}>
          <Menus.Button
            icon={<HiEye />}
            onClick={() => navigate(`/bookings/${bookingId}`)}
          >
            See details
          </Menus.Button>
        </Menus.List>
      </Menus.Menu>
    </Table.Row>
  );
}

export default BookingRow;
