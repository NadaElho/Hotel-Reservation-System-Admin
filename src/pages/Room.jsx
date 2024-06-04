import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { CiSquarePlus } from "react-icons/ci";
import axios from "axios";
import Pagination from "../components/Pagination";

export default function Room() {
  const [rooms, setRooms] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(4);
  const [noOfPages, setNoOfPages] = useState(1);

  const cols = [
    { col: "Room Name" },
    { col: "Images" },
    { col: "Room Type" },
    { col: "Room Amenities" },
    { col: "Status" },
    { col: "Action" },
  ];

  useEffect(() => {
    getAllRooms();
  }, [pageNum, limit]);

  const getAllRooms = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/rooms?limit=${limit}&page=${pageNum + 1}`
      );

      setNoOfPages(data.pagination.numberPages);

      if (data.status === "success") {
        const formattedData = data.data.map((room) => ({
          title_en: room.title_en,
          images: room.images,
          roomTypeId: room.roomTypeId.type_en,
          amenitiesIds: room.amenitiesIds
            .map((amenity) => amenity.name_en)
            .join(", "),
          status: "@mdo",
        }));
        setRooms(formattedData);
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
  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        <Button name="Add Room " icon={CiSquarePlus} navigate="addRoom" />
        <div className="p-4 border-2 border-gray-200 border-solid rounded-3xl dark:border-gray-700">
          <Table cols={cols} data={rooms} />
        </div>
        <div className="flex items-center justify-center py-3">
          <Pagination
            handleLimit={handleLimit}
            pageCount={noOfPages}
            handlePageClick={handlePageClick}
          />
        </div>
      </div>
    </>
  );
}
