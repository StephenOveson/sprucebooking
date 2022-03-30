import { atom } from "recoil";
import { Booking } from "../components/Table";

export const bookingState = atom<Booking[]>({
    key: "bookingState",
    default: null
})