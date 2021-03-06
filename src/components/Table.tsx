import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export type BookingStatus = "Cancelled" | "InProgress" | "Pending" | "Completed";
export type BookingType = "Housekeeping" | "Dogwalk";


export type Booking = {
    id?: string
    status: BookingStatus,
    email: string,
    name: string,
    type: BookingType
    address: string,
    serviceDate: string
};

enum Columns {
    "name" = 'Customer',
    'email' = 'Email',
    'address' = 'Address',
    'type' = 'Booking Type',
    'serviceDate' = 'Booking Date/Time'
};

const Table: React.FC<{ rows: Booking[] }> = ({ rows }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [column, setColumn] = useState("serviceDate");

    const updateCurrentPage = (paginate: 'NEXT' | 'PREV') => {
        switch (paginate) {
            case 'NEXT':
                if ((currentPage + 20) > rows.length) {
                    break;
                }
                setCurrentPage(val => val + 20);
                break;
            case "PREV":
                if (currentPage === 0) {
                    break;
                }
                setCurrentPage(val => val - 20);
                break;
            default:
                break;
        }
    }

    return (
        <>
            <table className="table table-auto w-full">
                <thead>
                    <tr>
                        {Object.entries(Columns).map(([col, title]) => <th onClick={() => setColumn(col)} key={col} className="text-xl font-medium text-neutral-600 text-left	p-4"><div className="flex flex-row">
                            {title}
                            <svg className="mx-4" xmlns="http://www.w3.org/2000/svg" fill={`${col === column ? "#fff" : ""}`} width="30" height="30" enableBackground="new 0 0 512 512" viewBox="0 0 512 512">
                                <path d="M163.919,494.293c-2.83,0-5.496-1.33-7.196-3.593L45.97,343.348c-2.986-3.974-2.187-9.615,1.787-12.602
				c3.974-2.986,9.616-2.187,12.602,1.787l103.557,137.777l103.493-137.775c2.986-3.975,8.627-4.775,12.602-1.791
				c3.974,2.985,4.775,8.627,1.79,12.602L171.113,490.698C169.414,492.961,166.749,494.293,163.919,494.293z"/>
                                <path d="M163.917 494.293c-4.971 0-9-4.029-9-9V26.192c0-4.971 4.029-9 9-9s9 4.029 9 9v459.101C172.917 490.264 168.888 494.293 163.917 494.293zM459.507 182.622c-2.734 0-5.435-1.241-7.203-3.597L348.78 41.18 245.257 179.025c-2.985 3.975-8.626 4.777-12.601 1.792-3.974-2.984-4.777-8.626-1.792-12.601l110.72-147.43c1.699-2.263 4.365-3.595 7.196-3.595s5.497 1.332 7.196 3.595l110.72 147.43c2.985 3.975 2.183 9.616-1.792 12.601C463.285 182.034 461.388 182.621 459.507 182.622z" /><path d="M348.78,494.293c-4.971,0-9-4.029-9-9V26.192c0-4.971,4.029-9,9-9s9,4.029,9,9v459.101
				C357.78,490.264,353.751,494.293,348.78,494.293z"/>
                            </svg>
                        </div>
                        </th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows?.filter((_, i) => i > currentPage && i < currentPage + 20).map(row => <TableRow key={row.name} row={row} />)}
                </tbody>
            </table>
            {rows?.length > 0 && <div className="flex w-full justify-center align-center">
                <button className="bg-white font-medium text-2xl pb-2 px-2 mx-1" onClick={() => updateCurrentPage("PREV")}>{"<"}</button>
                <button className="bg-white font-medium text-2xl pb-2 px-2 mx-1" onClick={() => updateCurrentPage("NEXT")}>{">"}</button>
            </div>}
        </>
    )
}

const TableRow: React.FC<{ row: Booking }> = ({ row }) => {
    return (
        <Link href={`/${row.id}`}>
            <tr className="hover:cursor-pointer text-neutral-600 bg-white border-b border-neutral-300">
                <td className="table-cell p-4">{row.name}</td>
                <td className="table-cell p-4">{row.email}</td>
                <td className="table-cell p-4">{row.address}</td>
                <td className="table-cell p-4">{row.type}</td>
                <td className="table-cell p-4">{dateFormatter(row.serviceDate)}</td>
            </tr>
        </Link>
    )

}

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export function dateFormatter(date: string) {
    const theDate = new Date(date);
    return `${monthNames[theDate.getMonth() + 1]} ${theDate.getDate()}, ${theDate.getFullYear()} at ${theDate.toLocaleTimeString()}`
}

export default Table