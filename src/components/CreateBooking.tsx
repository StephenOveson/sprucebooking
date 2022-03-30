import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { bookingState } from "../state/bookingState";
import { Booking } from "./Table";

interface CreateBooking extends Booking {
    time: string
    state: string
    zip: string
    city: string
}

const ADD_BOOKING = gql`
mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      status
      type
      email
      name
      address
      serviceDate
    }
  }`;


export const CreateBooking: React.FC<{ show: boolean, setShow: () => void }> 
    = ({ show, setShow }) => {
    const [bookings, setBookings] = useRecoilState(bookingState);
    const [booking, setBooking] = useState<CreateBooking>({
        name: "",
        email: "",
        address: "",
        type: "Housekeeping",
        serviceDate: "",
        status: "Pending",
        time: "0:00",
        city: null,
        state: null,
        zip: null
    });

    const [addBooking, { error }] = useMutation(ADD_BOOKING)

    const addBookingSubmit = () => {
        booking.address = `${booking.address}, ${booking.city}, ${booking.state}, ${booking.zip}`
        delete booking.city;
        delete booking.state;
        delete booking.zip;
        delete booking.time;
        delete booking.status;

        addBooking({
            variables: { input: booking }
        }).then(bookingData => {
            setBookings(bookings => [...bookings, bookingData.data.createBooking])
            setShow()
        })
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "time") {
            setBooking((current) => {
                const hours = parseInt(value.split(":")[0]);
                const minutes = parseInt(value.split(":")[1]);
                const selectedDate = new Date(current.serviceDate);
                selectedDate.setUTCHours(hours, minutes)
                return ({ ...current, time: value, serviceDate: selectedDate.toISOString() })
            })
            return;
        }
        if (name === "serviceDate") {
            setBooking((current) => {
                const hours = parseInt(current?.time?.split(":")[0]) || 0;
                const minutes = parseInt(current?.time?.split(":")[1]) || 0;
                let selectedDate = new Date(value);
                selectedDate.setUTCHours(hours, minutes)
                return ({ ...current, serviceDate: selectedDate.toISOString() })
            })
            return;
        }

        setBooking(current => ({ ...current, [name]: value }))
    }

    if (!show) {
        return null;
    }

    return <div className="rounded-md border-2 shadow-lg absolute top-1/4 right-1/4 bg-white w-2/5 h-1/2 p-2">
        <div className="flex flex-row justify-between">
            <h1 className="text-3xl">Create Booking</h1>
            <button className="self-start text-red-500 hover:animate-pulse" onClick={setShow}>X</button>
        </div>
        <main className="flex flex-row">
            <section className="flex flex-col w-1/2 p-4">
                <label htmlFor="name" className="text-neutral-800">Name</label>
                <input name="name" type="text" className="border-2 rounded-sm shadow-sm p-1 border-neutral-300" onChange={onChangeHandler} />
                <label htmlFor="email" className="text-neutral-800">Email</label>
                <input name="email" type="text" className="border-2 rounded-sm shadow-sm p-1 border-neutral-300" onChange={onChangeHandler} />
                <label htmlFor="address" className="text-neutral-800">Street Address</label>
                <input name="address" type="text" className="border-2 rounded-sm shadow-sm p-1 border-neutral-300" onChange={onChangeHandler} />
                <label htmlFor="city" className="text-neutral-800">City</label>
                <input name="city" type="text" className="border-2 rounded-sm shadow-sm p-1 border-neutral-300" onChange={onChangeHandler} />
                <div className="flex flex-row justify-between">
                    <div className="w-1/2 flex flex-col mr-4">
                        <label htmlFor="state" className="text-neutral-800">State</label>
                        <input name="state" type="text" className="w-full border-2 rounded-sm shadow-sm p-1 border-neutral-300" onChange={onChangeHandler} />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label htmlFor="zip" className="text-neutral-800">Zip Code</label>
                        <input name="zip" type="text" className="w-full border-2 rounded-sm shadow-sm p-1 border-neutral-300" onChange={onChangeHandler} />
                    </div>
                </div>
            </section>
            <section className="flex flex-col w-1/2 p-4">
                <label htmlFor="type" className="text-neutral-800">Booking Type</label>
                <select name="type" className="border-2 rounded-sm shadow-sm p-1 border-neutral-300" onChange={onChangeHandler}>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="DogWalk">Dogwalking</option>
                </select>
                <label htmlFor="serviceDate" className="text-neutral-800">Booking Date</label>
                <input name="serviceDate" type="date" className="border-2 rounded-sm shadow-sm p-1 border-neutral-300" onChange={onChangeHandler} />
                <label htmlFor="time" className="text-neutral-800">Booking Time</label>
                <input name="time" type="time" className="border-2 rounded-sm shadow-sm p-1 border-neutral-300" onChange={onChangeHandler} />
            </section>
        </main>
        <button onClick={addBookingSubmit} className="hover:animate-pulse absolute bottom-5 right-5 rounded-md text-lg font-medium shadow px-2 py-1 bg-orange-400">Create booking</button>
    </div>
}