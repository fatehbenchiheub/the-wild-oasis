import TableOperations from '../../ui/TableOperations';
import Filter from '../../ui/Filter';

function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterOptions="discount"
        options={[
          {
            value: 'all',
            label: 'all',
          },
          {
            value: 'No-discount',
            label: 'No discount',
          },
          {
            value: 'With-discount',
            label: 'Withdiscount',
          },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
