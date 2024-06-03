import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { CiSquarePlus } from "react-icons/ci";
import axios from "axios";

export default function History() {
  const [histories, setHistories,] = useState([]);
  const currentPage = 1;  // assuming the currentPage is 1 for simplicity
  const[renderDelete,seteRenderDelete]=useState(false);
  const cols = [
    { col: 'Id' },
    { col: 'User Name' },
    { col: 'User Photo' },
    { col: 'Room Name' },
    // { col: 'Room Type' },
    { col: 'CheckIn' },
    { col: 'CheckOut' },
    { col: 'Status' },
  ];


  useEffect(() => {
    getAllHistories();
  }, [currentPage,renderDelete]);

  const getAllHistories = async () => {
    const { data } = await axios.get(`http://localhost:3000/api/v1/reservations`,
    {
      headers: {
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGExYzlhZWM3OGIwMzU0ZDg1NTMwYSIsImVtYWlsIjoic2FtYXIxMjNAZ21haWwuY29tIiwiaWF0IjoxNzE3NDI5MDAxfQ.SdR0EKPgdIdLTonDHBgclzY3_FHRHPvDSGDidbUyn04",
    
      }
    }
    );
    console.log('data',data)
   
      const formattedData = data.data.map(history => ({
        id:history._id ,
       username:`${history.userId.firstName} ${history.userId.lastName}`,
       images:history.userId.images,
       roomName:history.roomId.title_en,
       checkIn:new Date(history.checkIn).toLocaleDateString(),
       checkOut:new Date(history.checkOut).toLocaleDateString(), 
       status:history.status.name_en

      }));
      console.log('formattedData',formattedData)
      setHistories(formattedData);
    
  }
 
  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-solid rounded-3xl dark:border-gray-700">
          <Table cols={cols} data={histories}   page='history'  />
        </div>
      </div>
    </>
  );
}
