import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditCabin, type CabinFormData } from '../../services/apiCabins';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export function useCreateCabin() {
  const queryClient = useQueryClient();
  const { reset } = useForm<CabinFormData>();

  // Cabin creation mutation
  const { mutate: createCabin, isPending: isCreating } = useMutation({
    mutationFn: (newCabin: CabinFormData) => createEditCabin(newCabin),
    onSuccess: () => {
      toast.success('New cabin created successfully!');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  return { createCabin, isCreating };
}
