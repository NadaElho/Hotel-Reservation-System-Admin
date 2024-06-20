import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { CiSquarePlus } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import Button from "../components/Button";
import ConfirmDelete from "../components/ConfirmDelete";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosInstance from "../interceptor";
import Pagination from "../components/Pagination";

export default function Promotion() {
  const [promotions, setPromotions] = useState([]);
  const [renderDelete, seteRenderDelete] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [limit, setLimit] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [idDelete, setIdDelete] = useState("");
  const [truncated, setTruncated] = useState([]);
  const [noOfPages, setNoOfPages] = useState(1);
  const [pageNum, setPageNum] = useState(0);
  const toggleTruncated = (index) => {
    setTruncated((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const arrOfCards = [];
  for (let i = 0; i < limit; i++) {
    arrOfCards.push(i);
  }

  useEffect(() => {
    getAllPromotions();
  }, [pageNum, limit, renderDelete]);

  const getAllPromotions = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/promotions?limit=${limit}&page=${pageNum + 1}`
      );
      setNoOfPages(data.pagination.numberPages);
      const formattedData = data.data.map((promotion) => ({
        id: promotion._id,
        title: promotion.title_en,
        percentage: promotion.percentage,
      }));
      setPromotions(formattedData);
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
  const deletePromotion = async (id) => {
    await axiosInstance.delete(`/promotions/${id}`);
    seteRenderDelete(!renderDelete);
    toast("promotion deleted successfully");
  };

  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        <div className=" me-10 ">
          <Button
            name="Add Promotion"
            icon={CiSquarePlus}
            navigate="/promotions/add"
          />
        </div>
        <div className="flex justify-center items-center">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8 mx-8 w-full">
              {arrOfCards.map((num) => (
                <div key={num}>
                  <Skeleton className="w-full rounded-3xl" height={208} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-8 w-full">
              {promotions.map((promotion, index) => (
                <div
                  key={index}
                  className="flex justify-center p-5 items-center flex-col border-2 rounded-3xl border-[#52381D]"
                >
                  <div className="flex items-center justify-between w-40">
                    <div className="bg-main-400  text-white text-xl py-5  px-4 font-bold rounded-full">
                      {promotion.percentage} %
                    </div>
                    <p className="text-main-800 text-lg font-bold">
                      {promotion.title}
                    </p>
                  </div>

                  <Link
                    to={`/promotions/edit/${promotion.id}`}
                    className="text-white w-32 mt-5 mb-2 lg:w-40 bg-[#52381D] rounded-3xl right-0 hover:bg-[#52381D]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium text-sm py-2 inline-flex items-center justify-center"
                  >
                    <FaRegEdit className="w-4 h-4 me-2" /> Edit
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedName(promotion.title);
                      setIdDelete(promotion.id);
                      setShowModal(true);
                    }}
                    className="text-[#C90000] w-32 lg:w-40 border border-[#C90000] rounded-3xl right-0 hover:text-white hover:bg-[#C90000]/60 focus:ring-4 focus:outline-none focus:ring-[#C90000]/80 font-medium text-sm py-2 inline-flex items-center justify-center"
                  >
                    <RiDeleteBinLine className="w-4 h-4 me-2" /> Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className={`${
            isLoading ? "hidden" : "flex"
          } items-center justify-center py-3`}
        >
          <Pagination
            handleLimit={handleLimit}
            limit={limit}
            pageCount={noOfPages}
            handlePageClick={handlePageClick}
          />
        </div>
        {showModal && (
          <ConfirmDelete
            page="promotion"
            name={selectedName}
            onClose={() => setShowModal(false)}
            onConfirm={() => {
              deletePromotion(idDelete);
              setShowModal(false);
            }}
          />
        )}
      </div>
    </>
  );
}
