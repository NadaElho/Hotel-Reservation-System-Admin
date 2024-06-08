import { useEffect, useState } from "react";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import axiosInstance from "../interceptor";

export default function History() {
  const [histories, setHistories] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(4);
  const [noOfPages, setNoOfPages] = useState(1);
  const [renderDelete, seteRenderDelete] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [isLoading, setLoading] = useState(false);
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
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/reservations?limit=${limit}&page=${pageNum + 1}`
      );
      // setLoading(false);
      const formattedData = data.data?.map((history) => ({
        id: history._id,
        username: `${history.userId?.firstName} ${history.userId.lastName}`,
        images: history.userId?.images,
        roomName: history.roomId?.title_en,
        checkIn: new Date(history?.checkIn).toLocaleDateString(),
        checkOut: new Date(history?.checkOut).toLocaleDateString(),
        status: history.status?.name_en,
      }));
      setHistories(formattedData);
      setNoOfPages(data.pagination.numberPages);
      setLoading(false);
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
        <div className="p-4 border-2 overflow-hidden border-gray-200 border-solid rounded-3xl dark:border-gray-700">
          <Table cols={cols} data={histories} page="history"  isLoading={isLoading} />
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
