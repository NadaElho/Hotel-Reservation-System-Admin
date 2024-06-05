import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { CiSquarePlus, CiEdit, CiTrash } from "react-icons/ci";
import axios from "axios";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { Link } from "react-router-dom"; // Import Link for navigation

export default function Room() {
  const [rooms, setRooms] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(4);
  const [noOfPages, setNoOfPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const cols = [
    { col: "Room Name" },
    { col: "Room Type" },
    { col: "Images" },
    { col: "Status" },
    { col: "Room Amenities" },
    { col: "Action" },
  ];

  useEffect(() => {
    getAllRooms();
  }, [pageNum, limit]);

  const getAllRooms = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/rooms?limit=${limit}&page=${pageNum + 1}`
      );
      console.log(data.data[0]);
      setNoOfPages(data.pagination.numberPages);

      if (data.status === "success") {
        const formattedData = data.data.map((room) => ({
          id: room.id, // Added room id
          title_en: room.title_en,
          images: room.images,
          roomTypeId: room.roomTypeId.type_en,
          amenitiesIds: room.amenitiesIds
            .map((amenity) => amenity.name_en)
            .join(", "),
          status: room.status, // Adjusted status field
        }));
        setRooms(formattedData);
      }
      setLoading(false);
    } catch (err) {
      console.log(err.response?.data || err.message, "err");
      setLoading(false);
    }
  };

  const handleLimit = (num) => {
    setLimit(num);
  };

  const handlePageClick = (data) => {
    setPageNum(data.selected);
  };

  const handleDeleteClick = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:3000/api/v1/rooms/${roomId}`);
        getAllRooms();
        setLoading(false);
      } catch (err) {
        console.log(err.response?.data || err.message, "err");
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="lg:p-14 p-7 sm:ml-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="lg:p-14 p-7 sm:ml-64">
      <Link to="addroom">
        <Button name="Add Room " icon={CiSquarePlus} />
      </Link>
      <div className="p-4 border-2 border-gray-200 border-solid rounded-3xl dark:border-gray-700">
        <Table cols={cols} data={rooms}>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.title_en}</td>
              <td>{room.images.join(", ")}</td>
              <td>{room.roomTypeId}</td>
              <td>{room.amenitiesIds}</td>
              <td>{room.status}</td>
              <td>
                <Link to={`/rooms/editroom/${room.id}`}>
                  <Button icon={CiEdit} />
                </Link>
              </td>
              <td>
                <Button
                  icon={CiTrash}
                  onClick={() => handleDeleteClick(room.id)}
                  color="red"
                />
              </td>
            </tr>
          ))}
        </Table>
        <Pagination pageCount={noOfPages} onPageChange={handlePageClick} />
      </div>
    </div>
  );
}
