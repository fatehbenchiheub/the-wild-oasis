import { isFuture, isPast, isToday } from 'date-fns';
import { useState } from 'react';
import supabase from '../services/supabase.ts';
import Button from '../ui/Button.tsx';
import { subtractDates } from '../utils/helpers.ts';
import { bookings } from './data-bookings.ts';
import { cabins } from './data-cabins.ts';
import { guests } from './data-guests.ts';

type BookingStatus = 'checked-out' | 'unconfirmed' | 'checked-in';

async function deleteGuests(): Promise<void> {
  const { error } = await supabase.from('guests').delete().gt('id', 0);
  if (error) console.error(error.message);
}

async function deleteCabins(): Promise<void> {
  const { error } = await supabase.from('cabins').delete().gt('id', 0);
  if (error) console.error(error.message);
}

async function deleteBookings(): Promise<void> {
  const { error } = await supabase.from('bookings').delete().gt('id', 0);
  if (error) console.error(error.message);
}

async function createGuests(): Promise<void> {
  const { error } = await supabase.from('guests').insert(guests);
  if (error) console.error(error.message);
}

async function createCabins(): Promise<void> {
  const { error } = await supabase.from('cabins').insert(cabins);
  if (error) console.error(error.message);
}

async function createBookings(): Promise<void> {
  const { data: guestsIds, error: guestError } = await supabase
    .from('guests')
    .select('id')
    .order('id');

  if (guestError) console.error(guestError.message);
  const allGuestIds = (guestsIds ?? []).map(
    (guest: { id: number }) => guest.id
  );

  const { data: cabinsIds, error: cabinError } = await supabase
    .from('cabins')
    .select('id')
    .order('id');

  if (cabinError) console.error(cabinError.message);
  const allCabinIds = (cabinsIds ?? []).map(
    (cabin: { id: number }) => cabin.id
  );

  const finalBookings = bookings.map((booking) => {
    const cabin = cabins.at(booking.cabinId - 1);

    if (!cabin) {
      throw new Error(`Cabin with index ${booking.cabinId - 1} not found.`);
    }

    const numNights = subtractDates(booking.endDate, booking.startDate);
    const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
    const extrasPrice = booking.hasBreakfast
      ? numNights * 15 * booking.numGuests
      : 0;
    const totalPrice = cabinPrice + extrasPrice;

    let status: BookingStatus = 'unconfirmed';
    if (
      isPast(new Date(booking.endDate)) &&
      !isToday(new Date(booking.endDate))
    ) {
      status = 'checked-out';
    } else if (
      isFuture(new Date(booking.startDate)) ||
      isToday(new Date(booking.startDate))
    ) {
      status = 'unconfirmed';
    } else if (
      (isFuture(new Date(booking.endDate)) ||
        isToday(new Date(booking.endDate))) &&
      isPast(new Date(booking.startDate)) &&
      !isToday(new Date(booking.startDate))
    ) {
      status = 'checked-in';
    }

    return {
      ...booking,
      numNights,
      cabinPrice,
      extrasPrice,
      totalPrice,
      guestId: allGuestIds.at(booking.guestId - 1),
      cabinId: allCabinIds.at(booking.cabinId - 1),
      status,
    };
  });

  console.log(finalBookings);

  const { error } = await supabase.from('bookings').insert(finalBookings);
  if (error) console.error(error.message);
}

export function Uploader() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function uploadAll(): Promise<void> {
    setIsLoading(true);
    await deleteBookings();
    await deleteGuests();
    await deleteCabins();

    await createGuests();
    await createCabins();
    await createBookings();
    setIsLoading(false);
  }

  async function uploadBookings(): Promise<void> {
    setIsLoading(true);
    await deleteBookings();
    await createBookings();
    setIsLoading(false);
  }

  return (
    <div
      style={{
        marginTop: 'auto',
        backgroundColor: '#e0e7ff',
        padding: '8px',
        borderRadius: '5px',
        textAlign: 'center',
      }}
    >
      <h3>DEV AREA</h3>

      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL sample data
      </Button>
      <p>Only run this only once!</p>
      <p>
        <em>(Cabin images need to be uploaded manually)</em>
      </p>
      <hr />
      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload CURRENT bookings
      </Button>
      <p>You can run this every day you develop the app</p>
    </div>
  );
}
