import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditCabin, type CabinFormData } from '../../services/apiCabins';
import toast from 'react-hot-toast';

export function useEditCabin(editId: number) {
  const queryClient = useQueryClient();

  // Cabin editing mutation
  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: (newCabin: CabinFormData) => createEditCabin(newCabin, editId),
    onSuccess: () => {
      toast.success('Cabin has been edited successfully!');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { editCabin, isEditing };
}
