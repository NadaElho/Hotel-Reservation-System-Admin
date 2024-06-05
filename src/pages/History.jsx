import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { CiSquarePlus } from "react-icons/ci";
import axios from "axios";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

export default function History() {
  const [histories, setHistories] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(4);
  const [noOfPages, setNoOfPages] = useState(1);
  const [renderDelete, seteRenderDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const cols = [
    { col: "Id" },
    { col: "User Name" },
    { col: "User Photo" },
    { col: "Room Name" },
    // { col: 'Room Type' },
    { col: "CheckIn" },
    { col: "CheckOut" },
    { col: "Status" },
  ];

  useEffect(() => {
    getAllHistories();
  }, [pageNum, limit, renderDelete]);

  const getAllHistories = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/reservations?limit=${limit}&page=${
          pageNum + 1
        }`,
        {
          headers: {
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGExYzlhZWM3OGIwMzU0ZDg1NTMwYSIsImVtYWlsIjoic2FtYXIxMjNAZ21haWwuY29tIiwiaWF0IjoxNzE3NDI5MDAxfQ.SdR0EKPgdIdLTonDHBgclzY3_FHRHPvDSGDidbUyn04",
          },
        }
      );
      setNoOfPages(data.pagination.numberPages);
      const formattedData = data.data.map((history) => ({
        id: history._id,
        username: `${history.userId.firstName} ${history.userId.lastName}`,
        images: history.userId.images,
        roomName: history.roomId.title_en,
        checkIn: new Date(history.checkIn).toLocaleDateString(),
        checkOut: new Date(history.checkOut).toLocaleDateString(),
        status: history.status.name_en,
      }));
      setHistories(formattedData);
      setLoading(false)
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
  if (loading) {
    return <div className="lg:p-14 p-7 sm:ml-64">
      <Loader/>
    </div>;
  }
  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-solid rounded-3xl dark:border-gray-700">
          <Table cols={cols} data={histories} page="history" />
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
