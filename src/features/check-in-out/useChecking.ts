import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function useChecking() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const payload = { status: 'checked-in', isPaid: true };

  const { mutate: checking, isPending: isCheckingIn } = useMutation({
    mutationFn: (bookingId: number) => updateBooking({ bookingId, payload }),

    onSuccess: () => {
      toast.success('Booking successfully Checked in');
      queryClient.invalidateQueries({ type: 'active' });
      navigate('/');
    },

    onError: () => toast.error('There was an error while Check in'),
  });

  return { checking, isCheckingIn };
}
