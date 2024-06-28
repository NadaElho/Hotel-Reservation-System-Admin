import { useEffect, useState } from "react";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import axiosInstance from "../interceptor";
import { toast } from "react-toastify";
export default function History() {
  const [histories, setHistories] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(3);
  const [noOfPages, setNoOfPages] = useState(1);
  const [renderDelete, seteRenderDelete] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [noOfAllReservations, setNoOfAllReservations] = useState(0);
  const [noOfPending, setNoOfPending] = useState(0);
  const [noOfBooked, setNoOfBooked] = useState(0);
  const [noOfCanceled, setNoOfCanceled] = useState(0);

  const cols = [
    { col: "Id" },
    { col: "User Name" },
    { col: "User Photo" },
    { col: "Room Name" },
    // { col: 'Room Type' },
    { col: "CheckIn" },
    { col: "CheckOut" },
    { col: "Status" },
    { col: "Paid" },
    { col: "Action" },
  ];

  useEffect(() => {
    getAllHistories();
    filter();
  }, [pageNum, limit, renderDelete]);

  const filter = async () => {
    try {
      const reservationsResponse = await axiosInstance.get(
        `/reservations?limit=100&page=1`
      );
      const reservations = reservationsResponse.data.data;
      const pendingReservations = reservations.filter(
        (reservations) =>
          reservations.status.name_en.toUpperCase() == "pending".toUpperCase()
      );
      const bookedReservations = reservations.filter(
        (reservations) =>
          reservations.status.name_en.toUpperCase() == "completed".toUpperCase()
      );
      const cancelledReservations = reservations.filter(
        (reservations) =>
          reservations.status.name_en.toUpperCase() == "canceled".toUpperCase()
      );

      setNoOfPending(pendingReservations.length);
      setNoOfBooked(bookedReservations.length);
      setNoOfCanceled(cancelledReservations.length);
    } catch (err) {
      console.log(err.response?.data || err.message, "err");
    }
  };
  const getAllHistories = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(
        `/reservations?limit=${limit}&page=${pageNum + 1}`
      );
      setNoOfAllReservations(data.pagination.documentCount);
      const formattedData = data.data?.map((history) => ({
        id: history._id,
        username: `${history.userId?.firstName} ${history.userId.lastName}`,
        images: history.userId?.images,
        roomName: history.roomId?.title_en,
        checkIn: new Date(history?.checkIn).toLocaleDateString(),
        checkOut: new Date(history?.checkOut).toLocaleDateString(),
        status: history.status?.name_en,
        paid: history.paid.toString(),
      }));
      // console.log("formattedData ", formattedData);
      setHistories(formattedData);
      setNoOfPages(data.pagination.numberPages);
      setLoading(false);
    } catch (err) {
      console.log(err.response?.data || err.message, "err");
    }
  };
  const pay = async (id) => {
    await axiosInstance.patch(`/reservations/${id}/paid`);
    seteRenderDelete(!renderDelete);
    toast("reservations pay successfully");
  };
  const handleLimit = (num) => {
    setLimit(num);
  };

  const handlePageClick = (data) => {
    setPageNum(data.selected);
  };

  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        <div className="hidden md:flex   items-center justify-center py-3  text-main-800">
          <div className="border-e border-main-800 pe-5 me-5">
            <p className="font-bold">All Histories</p>
            <p>({noOfAllReservations})</p>
          </div>
          <div className="border-e border-main-800 pe-5 me-5">
            <p className="font-bold">Pending</p>
            <p>({noOfPending})</p>
          </div>
          <div className="border-e border-main-800 pe-5 me-5">
            <p className="font-bold">Booked</p>
            <p>({noOfBooked})</p>
          </div>
          <div>
            <p className="font-bold">Canceled</p>
            <p>({noOfCanceled})</p>
          </div>
        </div>
        <div className="p-4 border-2 overflow-hidden border-gray-200 border-solid rounded-3xl dark:border-gray-700">
          <Table
            cols={cols}
            data={histories}
            page="reservation"
            isLoading={isLoading}
            limit={limit}
            handleDelete={pay}
          />
        </div>
        <div className="flex items-center justify-center py-3">
          <Pagination
            handleLimit={handleLimit}
            limit={limit}
            pageCount={noOfPages}
            handlePageClick={handlePageClick}
          />
        </div>
      </div>
    </>
  );
}
