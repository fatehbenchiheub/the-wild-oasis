import styled from 'styled-components';

import UpdateUserDataForm from '../features/authentication/UpdateUserDataForm';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import UpdatePasswordForm from '../features/authentication/UpdatePasswordForm';

const StyledAccount = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  padding: 2.4rem 0;
`;

const StyledRow = styled(Row)`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: 2.4rem 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

function Account() {
  return (
    <StyledAccount>
      <Heading as="h1">Update your account</Heading>

      <StyledRow>
        <Heading as="h3">Update user data</Heading>
        <UpdateUserDataForm />
      </StyledRow>

      <StyledRow>
        <Heading as="h3">Update password</Heading>
        <UpdatePasswordForm />
      </StyledRow>
    </StyledAccount>
  );
}

export default Account;
