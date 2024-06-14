import { useEffect, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { toast } from "react-toastify";

import Table from "../components/Table";
import Button from "../components/Button";
import Pagination from "../components/Pagination";
import axiosInstance from "../interceptor";

export default function Room() {
  const [rooms, setRooms] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(3);
  const [noOfAllRooms, setNoOfAllRooms] = useState(0);
  const [noOfPages, setNoOfPages] = useState(1);
  const [noOfAvailablRooms, setNoOfAvailablRooms] = useState(0);
  const [noOfBookedRooms, setNoOfBookedRooms] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [renderDelete, seteRenderDelete] = useState(false);

  const cols = [
    { col: "Id" },
    { col: "Room Name" },
    { col: "Images" },
    { col: "Room Type" },
    { col: "Amenities" },
    { col: "Action" },
  ];

  useEffect(() => {
    getAllRooms();
    filter();
  }, [pageNum, limit, renderDelete]);
  const filter = async () => {
    try {
      const room = await axiosInstance.get(`/rooms?limit=100&page=1`);
      const reservationsResponse = await axiosInstance.get(
        `/reservations?limit=100&page=1`
      );
      const reservations = reservationsResponse.data.data;
      const bookedReservations = reservations.filter(
        (reservations) => reservations.status.name_en == "pending"
      );
      const bookedRoomIds = bookedReservations.map(
        (reservation) => reservation.roomId?._id
      );
      const bookedRooms = room.data.data.filter((room) =>
        bookedRoomIds.includes(room._id)
      );
      setNoOfAvailablRooms(room.data.data.length - bookedRooms.length);
      setNoOfBookedRooms(bookedRooms.length);
    } catch (err) {
      console.log(err.response?.data || err.message, "err");
    }
  };

  const getAllRooms = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/rooms?limit=${limit}&page=${pageNum + 1}`
      );

      setNoOfPages(data.pagination.numberPages);
      setNoOfAllRooms(data.pagination.documentCount);

      if (data.status === "success") {
        const formattedData = data.data.map((room) => ({
          id: room._id,
          title_en: room.title_en,
          images: room?.images,
          roomTypeId: room.roomTypeId.type_en,
          amenitiesIds: room.amenitiesIds
            .map((amenity) => amenity.name_en)
            .join(", "),
        }));
        // console.log("bookedRooms", bookedRooms);
        setRooms(formattedData);
        setLoading(false);
      }
    } catch (err) {
      console.log(err.response?.data || err.message, "err");
    }
  };

  const handleLimit = (num) => {
    setLimit(num);
  };

  const handlePageClick = (data) => {
    setPageNum(data.selected);
  };

  const handleDeleteClick = async (roomId) => {
    await axiosInstance.delete(`/rooms/${roomId}`);
    seteRenderDelete(!renderDelete);
    toast("Room deleted successfully");
  };

  return (
    <div className="lg:p-14 p-7 sm:ml-64">
      <div className="flex items-center justify-center py-3  text-main-800">
        <div className="border-e border-main-800 pe-5 me-5">
          <p className="font-bold">All Rooms</p>
          <p>({noOfAllRooms})</p>
        </div>
        <div className="border-e border-main-800 pe-5 me-5">
          <p className="font-bold">Available rooms</p>
          <p>({noOfAvailablRooms})</p>
        </div>
        <div>
          <p className="font-bold">Booked</p>
          <p>({noOfBookedRooms})</p>
        </div>
      </div>
      <Button name="Add Room " icon={CiSquarePlus} navigate="addRoom" />
      <div className="p-4 border-2 overflow-hidden border-gray-200 border-solid rounded-3xl dark:border-gray-700">
        <Table
          cols={cols}
          data={rooms}
          linkEdit="editRoom"
          page="room"
          handleDelete={handleDeleteClick}
          isLoading={isLoading}
          limit={limit}
        />
      </div>
      <div className="flex items-center justify-center py-3">
        {rooms.length ? (
          <Pagination
            handleLimit={handleLimit}
            limit={limit}
            pageCount={noOfPages}
            handlePageClick={handlePageClick}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
