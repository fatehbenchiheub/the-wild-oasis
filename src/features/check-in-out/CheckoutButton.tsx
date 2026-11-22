import Button from '../../ui/Button';
import useCheckout, { type CheckinParam } from '../bookings/useChekout';

function CheckoutButton({ bookingId }: CheckinParam) {
  const { checkout, isCheckinOut } = useCheckout();
  return (
    <Button
      variation="primary"
      size="small"
      onClick={() => checkout({ bookingId })}
      disabled={isCheckinOut}
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
