import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateBooking,
  type BookingUpdatePayload,
} from '../../services/apiBookings';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export type BreakfastPayload = {
  hasBreakfast: true;
  extrasPrice: number;
  totalPrice: number;
};

export type CheckinParam = {
  bookingId: number;
  breakfast?: BreakfastPayload;
};

export default function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isPending: isCheckinIn } = useMutation({
    mutationFn: ({ bookingId, breakfast }: CheckinParam) => {
      const payload: BookingUpdatePayload = {
        status: 'checked-in',
        isPaid: true,
      };

      if (breakfast) {
        payload.hasBreakfast = breakfast.hasBreakfast;
        payload.extrasPrice = breakfast.extrasPrice;
        payload.totalPrice = breakfast.totalPrice;
      }

      return updateBooking({ bookingId, payload });
    },

    onSuccess: () => {
      toast.success('Booking successfully Checked in');
      queryClient.invalidateQueries({ type: 'active' });
      navigate('/');
    },

    onError: () => toast.error('There was an error while Check in'),
  });

  return { checkin, isCheckinIn };
}
