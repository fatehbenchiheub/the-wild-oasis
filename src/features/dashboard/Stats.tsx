import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import Stat from './Stat';
import { formatCurrency } from '../../utils/helpers';

type StatGuestStays = {
  fullName?: string;
};

type BookingSummary = {
  created_at?: string;
  extrasPrice?: number;
  totalPrice: number;
};

type ConfirmedStay = {
  cabinId?: number;
  cabinPrice?: number;
  created_at?: string;
  endDate?: string;
  extrasPrice?: number;
  guestId?: number;
  guests?: StatGuestStays;
  hasBreakfast?: boolean;
  id?: number;
  isPaid?: boolean;
  numGuests?: number;
  numNights: number;
  observations?: string; // instead of literal ''
  status?: string;
  totalPrice: number;
};

type StatsProps = {
  bookings: BookingSummary[]; // likely an array, not a single object
  confirmedStays: ConfirmedStay[]; // likely an array, not a single object
  numDays: number;
  cabinCount: number;
};

function Stats({ bookings, confirmedStays, numDays, cabinCount }: StatsProps) {
  // 1-
  const numBookings = bookings.length;

  // 2-
  const numSales = bookings.reduce((acc, curr) => acc + curr?.totalPrice, 0);

  // 3-
  const checkins = confirmedStays.length;

  // 4-
  const occupation =
    confirmedStays.reduce((acc, curr) => acc + curr?.numNights, 0) /
    (numDays * cabinCount);
  return (
    <>
      <Stat
        title="Bookings"
        icon={<HiOutlineBriefcase />}
        color="blue"
        value={numBookings}
      />
      <Stat
        title="Sales"
        icon={<HiOutlineBanknotes />}
        color="green"
        value={formatCurrency(numSales)}
      />
      <Stat
        title="Check ins"
        icon={<HiOutlineCalendarDays />}
        color="indigo"
        value={checkins}
      />
      <Stat
        title="Occupancy rate"
        icon={<HiOutlineChartBar />}
        color="yellow"
        value={Math.round(occupation * 100) + '%'}
      />
    </>
  );
}

export default Stats;
