import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';

export type CheckinParam = {
  bookingId: number;
};

export default function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isPending: isCheckinOut } = useMutation({
    mutationFn: ({ bookingId }: CheckinParam) => {
      const payload = {
        status: 'checked-out',
      };

      return updateBooking({ bookingId, payload });
    },

    onSuccess: () => {
      toast.success('Booking successfully Checked out');
      queryClient.invalidateQueries({ type: 'active' });
    },

    onError: () => toast.error('There was an error while Check out'),
  });

  return { checkout, isCheckinOut };
}
