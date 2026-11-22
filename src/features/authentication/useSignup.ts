import { useMutation } from '@tanstack/react-query';
import { signup as signupApi } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useSignup() {
  const { mutate: signup, isPending } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      toast.success(
        "Account successfully created! Please verify the new account from the user's email box"
      );
    },
    // Add this onError handler
    onError: (error) => {
      toast.error(error.message || 'Signup failed. Please try again.');
    },
  });

  return { signup, isPending };
}
