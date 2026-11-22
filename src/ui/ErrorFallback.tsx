import styled from 'styled-components';
// import Heading from './Heading';
import type { FallbackProps } from 'react-error-boundary';
import { GlobalStyle } from '../styles/globalStyles';

const StyledErrorFallback = styled.main`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.8rem;
`;

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 4.8rem;
  flex: 0 1 96rem;
  text-align: center;

  & h1 {
    margin-bottom: 1.6rem;
  }

  & p {
    font-family: 'Sono';
    margin-bottom: 3.2rem;
    color: var(--color-grey-500);
  }
`;

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <>
      <GlobalStyle />
      <StyledErrorFallback role="alert">
        <p>Something went wrong:</p>
        <pre>{message}</pre>
        <button type="button" onClick={resetErrorBoundary}>
          Try again
        </button>
      </StyledErrorFallback>
    </>
  );
}
