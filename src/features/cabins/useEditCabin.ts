import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditCabin, type CabinFormData } from '../../services/apiCabins';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export function useEditCabin(editId: number) {
  const queryClient = useQueryClient();
  const { reset } = useForm<CabinFormData>();

  // Cabin editing mutation
  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: (newCabin: CabinFormData) => createEditCabin(newCabin, editId),
    onSuccess: () => {
      toast.success('Cabin has been edited successfully!');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  return { editCabin, isEditing };
}
