import { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { CiSquarePlus, CiEdit, CiTrash } from "react-icons/ci";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import axiosInstance from "../interceptor";


export default function Room() {
  const [rooms, setRooms] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(3);
  const [noOfPages, setNoOfPages] = useState(1);
  const [isLoading, setLoading] = useState(false);

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
  }, [pageNum, limit]);

  const getAllRooms = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/rooms?limit=${limit}&page=${pageNum + 1}`
      );
      setNoOfPages(data.pagination.numberPages);
      //  setLoading(false);
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
    try {
      setLoading(true);
      await axiosInstance.delete(`/rooms/${roomId}`);
      getAllRooms();
      setLoading(false);
    } catch (err) {
      console.log(err.response?.data || err.message, "err");
      setLoading(false);
    }
  };
  return (
    <div className="lg:p-14 p-7 sm:ml-64">
      <Button name="Add Room " icon={CiSquarePlus} navigate="addRoom" />
      <div className="p-4 border-2 overflow-hidden border-gray-200 border-solid rounded-3xl dark:border-gray-700">
        <Table
            cols={cols}
            data={rooms}
            linkEdit="editRoom"
            page="room"
            handleDelete={handleDeleteClick}
            isLoading={isLoading}
          />


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
    </div>
  );
}
