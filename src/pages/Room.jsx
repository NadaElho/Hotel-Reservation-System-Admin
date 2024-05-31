import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { CiSquarePlus } from "react-icons/ci";
import axios from "axios";

export default function Room() {
    const [rooms, setRooms] = useState([]);
    
    const currentPage = parseInt("1", 10);
    const cols=[
    {col:'Room Name'},
    {col: 'Room Type'},
    {col: 'Room Amenites'},
    {col:'Status'},
    {col:'Action'}
    ]
    useEffect(()=>{
        getAllRooms();
       
    },[currentPage])
    const getAllRooms = async () => {
        let data;
        data = await axios.get(
            `http://localhost:3000/api/v1/rooms?limit=6&page=${currentPage}`
          );
          console.log(data)
          console.log(data.data.data)
          if (data.data.status === "success") {
            setRooms(data.data.data);
          }
    }
  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        {/* <div className="relative h-16"> */}

        <Button name="Add Room " icon={CiSquarePlus }/>
        {/* </div> */}
        <div className="p-4 border-2 border-gray-200 border-solid rounded-3xl dark:border-gray-700">
          <Table  cols={cols} rooms={rooms}/>
        </div>
      </div>
    </>
  );
}
