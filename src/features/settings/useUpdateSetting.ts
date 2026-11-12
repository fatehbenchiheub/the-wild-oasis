import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateSetting as updateSettingApi } from '../../services/apiSettings';

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  // Cabin editing mutation
  const { mutate: updateSetting, isPending: isUpdating } = useMutation({
    mutationFn: (newSetting: object) => updateSettingApi(newSetting),
    onSuccess: () => {
      toast.success('Setting updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateSetting, isUpdating };
}
