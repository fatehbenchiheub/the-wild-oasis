import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateCurrentUser, type UpdateUserType } from '../../services/apiAuth';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: (vars: UpdateUserType) => updateCurrentUser(vars),
    onSuccess: () => {
      toast.success('User account successfully updated!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { updateUser, isUpdating };
}
