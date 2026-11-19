import { getToday } from '../utils/helpers';
import supabase from './supabase';
import { PAGE_SIZE } from '../utils/constants';

type FilterType = {
  field: string;
  value: string;
};

type SortType = {
  field: string;
  direction: string;
};

type GetBookingsParam = {
  filter: FilterType | null;
  sortBy: SortType;
  page: number;
};

export async function getBookings({ filter, sortBy, page }: GetBookingsParam) {
  let query = supabase
    .from('bookings')
    .select('*, cabins(name), guests(fullName, email)', { count: 'exact' });

  // Filter conditionally
  if (filter) query = query.eq(filter.field, filter.value);

  // Sort
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === 'asc',
    });

  //Pagination
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error('bookings could not be loaded!');
  }
  return { data, count };
}

export async function getBooking(id: number) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, cabins(*), guests(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking not found');
  }
  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date: Date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('created_at, totalPrice, extrasPrice')
    .gte('created_at', date)
    .lte('created_at', getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date: Date) {
  const { data, error } = await supabase
    .from('bookings')
    // .select('*')
    .select('*, guests(fullName)')
    .gte('startDate', date)
    .lte('startDate', getToday());

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(fullName, nationality, countryFlag)')
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order('created_at');

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }
  return data;
}
// This type MUST mirror what .update() accepts (ideally generated from Supabase).
export type BookingUpdatePayload = {
  status: string;
  isPaid?: boolean;
  hasBreakfast?: boolean;
  extrasPrice?: number;
  totalPrice?: number;
};

type UpdateParam = {
  bookingId: number;
  payload: BookingUpdatePayload;
};

export async function updateBooking({ bookingId, payload }: UpdateParam) {
  console.log(payload, bookingId);

  const { data, error } = await supabase
    .from('bookings')
    .update(payload) // ← payload is now guaranteed to be DB-shaped
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  return data;
}

export async function deleteBooking(id: number) {
  const { data, error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)
    .select(); // ← returns the deleted rows

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }

  // RLS blocks return { data: [], error: null } — no error thrown by Supabase
  if (!data || data.length === 0) {
    throw new Error(
      'Booking could not be deleted — check your RLS DELETE policy on the bookings table'
    );
  }

  return data[0];
}
