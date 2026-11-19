import styled from 'styled-components';

import BookingDataBox from './BookingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from './useBooking';
import Spinner from '../../ui/Spinner';
import { useNavigate } from 'react-router-dom';
import useCheckout from './useChekout';
//import { HiArrowUpOnSquare } from 'react-icons/hi2';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

const statusToTagName: Record<string, 'blue' | 'green' | 'silver'> = {
  unconfirmed: 'blue',
  'checked-in': 'green',
  'checked-out': 'silver',
};

function BookingDetail() {
  const { booking, isPending } = useBooking();
  const moveBack = useMoveBack();
  const navigate = useNavigate();
  const { checkout, isCheckinOut } = useCheckout();

  if (isPending) return <Spinner />;
  if (!booking) return <p>Booking not found.</p>;

  const { status, id: bookingId } = booking;
  const tagColor = statusToTagName[status] ?? 'silver';

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={tagColor}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>← Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === 'unconfirmed' && (
          <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
            Check in
          </Button>
        )}

        {status === 'checked-in' && (
          <Button
            //icon={<HiArrowUpOnSquare />}
            onClick={() => checkout({ bookingId })}
            disabled={isCheckinOut}
          >
            Check out
          </Button>
        )}
        {/*
          <Button variation="secondary" onClick={moveBack}>
            Back
          </Button>
        */}
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
