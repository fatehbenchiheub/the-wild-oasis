import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';

export default function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteBookingRow } = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      toast.success('Booking deleted successfully!');
      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteBookingRow };
}
