import { useState, type ChangeEvent, type FormEvent } from 'react';
import styled from 'styled-components';

import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import { useUser } from './useUser';

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
`;

function UpdateUserDataForm() {
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName },
    },
  } = useUser();

  const [fullName, setFullName] = useState<string>(currentFullName ?? '');
  const [avatar, setAvatar] = useState<File | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFullName(e.target.value)
          }
          id="fullName"
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setAvatar(e.target.files?.[0] ?? null)
          }
        />
      </FormRow>
      <FormRow>
        <Actions>
          <Button type="reset" variation="secondary">
            Cancel
          </Button>
          <Button>Update account</Button>
        </Actions>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
