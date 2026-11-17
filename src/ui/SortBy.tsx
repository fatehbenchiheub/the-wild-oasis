import { useSearchParams } from 'react-router-dom';
import Select from './Select';

export type OptionItem = {
  value: string;
  label: string;
};

type SortByProps = {
  options: OptionItem[];
};

function SortBy({ options }: SortByProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || '';

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    searchParams.set('sortBy', e.target.value);
    setSearchParams(searchParams);
  }
  return (
    <div>
      <Select
        options={options}
        type="white"
        onChange={handleChange}
        value={sortBy}
      />
    </div>
  );
}

export default SortBy;
