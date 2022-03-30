import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import client from "../apollo-client";
import { Booking, dateFormatter } from "../components/Table";
import { bookingState } from "../state/bookingState";

export async function getServerSideProps() {
    const { data } = await client.query({
        query: gql`
            query Bookings {
                bookings {
                    id
                    status
                    type
                    name
                    email
                    address
                    serviceDate
                }
            }
        `,
    });

    return {
        props: {
            defaultBookings: data.bookings
        },
    };
}

const DELETE_BOOKING = gql`
mutation Mutation($bookingId: String!) {
    cancelBooking(bookingId: $bookingId) {
      id
    }
  }`;

const Booking: React.FC<{ defaultBookings: Booking[] }> = ({ defaultBookings }) => {
    const router = useRouter();
    const [bookings, setBookings] = useRecoilState(bookingState);
    const booking = useMemo(() => bookings?.find(booking => booking.id === router.query.bookingId), [bookings])

    useEffect(() => {
        setBookings(current => current.length > 0 ? current : defaultBookings)
    }, [])

    const [deleteBooking] = useMutation(DELETE_BOOKING);

    const removeBooking = () => {
        deleteBooking({variables: { bookingId: booking.id }})
        .then((bookingData) => {
            setBookings(bookingsArr => bookingsArr.filter(booking => bookingData.data.cancelBooking.id !== booking.id));
            router.push("/")
            return bookingData
        })
    }

    return (
        <main className="px-4 py-2">
            <div className="flex flex-row justify-between p-2">
                <h1 className="text-5xl">Booking Details</h1>
                <button onClick={removeBooking} className="bg-red-600 hover:animate-pulse rounded-md text-lg font-medium shadow px-2 py-1 text-white">Delete Booking</button>
            </div>
            <section className="bg-white flex flex-row my-4">
                <div className="flex flex-col py-3 px-4 w-1/2">
                    <h3 className="border-b text-2xl font-medium py-2">Customer Details</h3>
                    <div className="py-4">
                        <h5 className="text-lg">
                            {booking?.name}
                        </h5>
                        <h5 className="text-lg">
                            {booking?.email}
                        </h5>
                    </div>
                    <address className="py-4 w-1/4">
                        {booking?.address}
                    </address>
                </div>

                <div className="flex flex-col py-3 px-4 w-1/2 text-lg">
                    <h3 className="border-b text-2xl font-medium py-2">Details</h3>
                    <h5 className="py-4">
                        {booking?.type}
                    </h5>
                    <h5 className="py-4">
                        {dateFormatter(booking?.serviceDate)}
                    </h5>
                </div>
            </section>
        </main>
    )
}


export default Booking;