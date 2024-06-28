import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Table from "../components/Table";
import Pagination from "../components/Pagination";
import axiosInstance from "../interceptor";
export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(3);
  const [noOfPages, setNoOfPages] = useState(1);
  const [renderDelete, seteRenderDelete] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const cols = [
    { col: "Id" },
    { col: "Room Name" },
    { col: "Review" },
    { col: "User Name" },
    { col: "Rating" },
    { col: "Date" },
    { col: "Action" },
  ];

  useEffect(() => {
    getAllReviews();
  }, [pageNum, limit, renderDelete]);

  const getAllReviews = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(
        `/reviews?limit=${limit}&page=${pageNum + 1}`
      );

      const formattedData = data.data?.map((review) => ({
        id: review._id,
        roomName: review.roomId.title_en,
        name: review.title,
        username: `${review.userId?.firstName} ${review.userId.lastName}`,
        rating: review.rating,
        date: new Date(review?.date).toLocaleDateString(),
      }));
      setReviews(formattedData);
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
  const handleDeleteClick = async (reviews) => {
    await axiosInstance.delete(`/reviews/${reviews}`);
    seteRenderDelete(!renderDelete);
    toast("review deleted successfully");
  };
  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        <div className="p-4 border-2 overflow-hidden border-gray-200 border-solid rounded-3xl dark:border-gray-700">
          <Table
            cols={cols}
            data={reviews}
            page="review"
            isLoading={isLoading}
            handleDelete={handleDeleteClick}
            limit={limit}
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
