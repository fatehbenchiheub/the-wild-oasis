import styled from 'styled-components';
import { type OptionItem } from './SortBy';

const StyledSelect = styled.select<{ type: string }>`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === 'white'
        ? 'var(--color-grey-100)'
        : 'var(--color-grey-300)'};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

type SelectPropType = {
  options: OptionItem[];
  value: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement, Element>) => void;
};

function Select({ options, value, type, onChange }: SelectPropType) {
  return (
    <StyledSelect value={value} onChange={onChange} type={type}>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export default Select;
