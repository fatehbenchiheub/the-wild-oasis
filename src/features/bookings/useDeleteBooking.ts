import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function useDeleteBooking() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutateAsync: deleteBookingRow } = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      toast.success('Booking deleted successfully!');
      navigate('/bookings');

      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteBookingRow };
}
