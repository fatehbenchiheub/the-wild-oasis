import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCabin } from '../../services/apiCabins';
import toast from 'react-hot-toast';
import FormRow from '../../ui/FormRow';
import { type CabinFormData } from '../../services/apiCabins';

function CreateCabinForm() {
  const queryClient = useQueryClient();

  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success('New cabine created successfuly!');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const { register, handleSubmit, reset, getValues, formState } =
    useForm<CabinFormData>();
  const { errors } = formState;

  function onSubmit(data: CabinFormData) {
    // mutate({ ...data, image: data.image[0] });
    mutate(data);
  }

  function onError(errors: object) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="cabin name" error={errors?.name?.message as string}>
        <Input
          type="text"
          id="name"
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow
        label="cabin maxCapacity"
        error={errors?.maxCapacity?.message as string}
      >
        <Input
          type="number"
          id="maxCapacity"
          {...register('maxCapacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'capacity should be at leat 1 at minimum',
            },
          })}
        />
      </FormRow>

      <FormRow
        label="cabin regularPrice"
        error={errors?.regularPrice?.message as string}
      >
        <Input
          type="number"
          id="regularPrice"
          {...register('regularPrice', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow
        label="cabin discount"
        error={errors?.discount?.message as string}
      >
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register('discount', {
            required: 'This field is required',
            validate: (value) => {
              console.log('Discount value:', value);
              console.log('Regular price:', getValues().regularPrice);

              return (
                Number(value) <= Number(getValues().regularPrice) ||
                'The discount should be less than the regular price'
              );
            },
          })}
        />
      </FormRow>

      <FormRow
        label="cabin description"
        error={errors?.description?.message as string}
      >
        <Textarea
          // type="number"
          id="description"
          defaultValue=""
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label="cabin image" error={errors?.image?.message as string}>
        <FileInput id="image" accept="image/*" {...register('image')} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <>
          <Button variation="secondary" type="reset">
            Cancel
          </Button>
          <Button disabled={isCreating}>Edit cabin</Button>
        </>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
