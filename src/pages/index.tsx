import { gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import client from "../apollo-client";
import { CreateBooking } from "../components/CreateBooking";
import Table, { Booking } from "../components/Table";
import { bookingState } from "../state/bookingState";

export async function getStaticProps() {
    const { data } = await client.query({
        query: gql`
        query Query($order: SortOrder, $sortBy: BookingSortBy) {
            bookings(order: $order, sortBy: $sortBy) {
              id
              serviceDate
              status
              type
              email
              name
              address
            }
          }
        `,
        variables: { order: "ASC", sortBy: "serviceDate" }
    });

    return {
        props: {
            bookingDefault: data.bookings
        },
    };
}

export default function Home({ bookingDefault }: { bookingDefault: Booking[] }) {
    const [createBooking, setCreateBooking] = useState<boolean>(false);
    const [bookings, setBookings] = useRecoilState<Booking[]>(bookingState)

    useEffect(() => {
        setBookings(current => current?.length > 0 ? current : bookingDefault)
    }, [])
    
    const onClickBookingHandler = () => {
        setCreateBooking(book => !book)
    }   
    
    return (
        <main className="px-4 py-2">
            <section className="flex justify-between">
                <h1 className="text-3xl font-medium text-neutral-600">Bookings</h1>
                <button className="hover:animate-pulse rounded-md text-lg font-medium shadow px-2 py-1 bg-orange-400" onClick={onClickBookingHandler}>Create booking</button>
            </section>
            <Table rows={bookings} />
            <CreateBooking show={createBooking} setShow={onClickBookingHandler} />
        </main>);
}