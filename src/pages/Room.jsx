import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { CiSquarePlus } from "react-icons/ci";
import axios from "axios";


export default function Room() {
  const [rooms, setRooms] = useState([]);
  
  const currentPage = 1;  // assuming the currentPage is 1 for simplicity

  const cols = [
    { col: 'Room Name' },
    { col: 'Images' },
    { col: 'Room Type' },
    { col: 'Room Amenities' },
    { col: 'Status' },
    { col: 'Action' }
  ];

  useEffect(() => {
    getAllRooms();
  }, [currentPage]);

  const getAllRooms = async () => {
    const { data } = await axios.get(
      `http://localhost:3000/api/v1/rooms?limit=6&page=${currentPage}`
    );
    
    if (data.status === "success") {
      const formattedData = data.data.map(room => ({
        title_en: room.title_en,
        images: room.images,
        roomTypeId: room.roomTypeId.type_en,
        amenitiesIds: room.amenitiesIds.map(amenity => amenity.name_en).join(', '),
        status: "@mdo"  
      }));
      console.log(formattedData)
      setRooms(formattedData);
    }
  }

  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        <Button name="Add Room " icon={CiSquarePlus}  navigate = "addRoom"/>
        <div className="p-4 border-2 border-gray-200 border-solid rounded-3xl dark:border-gray-700">
          <Table cols={cols} data={rooms} />
        </div>
      </div>
    </>
  );
}
