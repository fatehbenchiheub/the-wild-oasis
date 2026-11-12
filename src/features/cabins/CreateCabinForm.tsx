import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import { useForm } from 'react-hook-form';
import FormRow from '../../ui/FormRow';
import { type CabinFormData } from '../../services/apiCabins';
import { useCreateCabin } from './useCreateCabin';
import { useEditCabin } from './useEditCabin';

type CabinEditProp = {
  cabinToEdit?: {
    id: number;
    name: string;
    maxCapacity: number;
    regularPrice: number;
    discount: number;
    description: string;
    image: string;
  };
};

function CreateCabinForm({ cabinToEdit }: CabinEditProp) {
  const { id: editId, ...editValues } = cabinToEdit ?? {};
  const isEditSession = Boolean(editId);

  const { createCabin, isCreating } = useCreateCabin();
  const { editCabin, isEditing } = useEditCabin(editId as number);

  const { register, handleSubmit, getValues, formState } =
    useForm<CabinFormData>({
      defaultValues: isEditSession ? editValues : {},
    });

  const { errors } = formState;

  function onSubmit(data: CabinFormData) {
    if (isEditSession) {
      editCabin(data);
    } else {
      createCabin(data);
    }
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
          {...register('name', { required: 'This field is required' })}
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
            min: { value: 1, message: 'Capacity should be at least 1' },
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
          {...register('regularPrice', { required: 'This field is required' })}
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
            validate: (value) =>
              Number(value) <= Number(getValues().regularPrice) ||
              'The discount should be less than the regular price',
          })}
        />
      </FormRow>

      <FormRow
        label="cabin description"
        error={errors?.description?.message as string}
      >
        <Textarea
          id="description"
          defaultValue=""
          {...register('description', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="cabin image" error={errors?.image?.message as string}>
        <FileInput
          id="image"
          accept="image/*"
          {...register('image', {
            required: isEditSession ? false : 'Uploading image is required',
          })}
        />
      </FormRow>

      <FormRow>
        <>
          <Button variation="secondary" type="reset">
            Cancel
          </Button>
          <Button disabled={isCreating || isEditing}>
            {isEditSession ? 'Edit cabin' : 'Create cabin'}
          </Button>
        </>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
