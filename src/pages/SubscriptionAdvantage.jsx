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
import NoPageFound from "../components/NoPageFound";

export default function SubscriptionAdvantage() {
  const [subscriptionsAdvantage, setSubscriptionsAdvantage] = useState([]);
  const [renderDelete, seteRenderDelete] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [limit, setLimit] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [idDelete, setIdDelete] = useState("");
  const [truncated, setTruncated] = useState([]);
  const [noOfPages, setNoOfPages] = useState(1);
  const [pageNum, setPageNum] = useState(0);
  const [NotPage, setNotPage] = useState(false);
  const toggleTruncated = (index) => {
    setTruncated((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const arrOfCards = [];
  for (let i = 0; i < limit; i++) {
    arrOfCards.push(i);
  }

  useEffect(() => {
    getAllSubscriptionsAdvantage();
  }, [pageNum, limit, renderDelete]);

  const getAllSubscriptionsAdvantage = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/subscription-advantage?limit=${limit}&page=${pageNum + 1}`
      );
      setNoOfPages(data.pagination.numberPages);
      const formattedData = data.data.map((subscriptionAdvantage) => ({
        id: subscriptionAdvantage._id,
        name: subscriptionAdvantage.name_en,
      }));
      setSubscriptionsAdvantage(formattedData);
      setLoading(false);
    } catch (err) {
      if (err.response.status == 404) {
        console.log(err.response.status, "kk");
        setSubscriptionsAdvantage([]);
        setNotPage(true);
      }
      console.log(err.response?.data || err.message, "err");
    }
  };
  const handleLimit = (num) => {
    setLimit(num);
  };

  const handlePageClick = (data) => {
    setPageNum(data.selected);
  };
  const deleteSubscriptionAdvantage = async (id) => {
    await axiosInstance.delete(`/subscription-advantage/${id}`);
    seteRenderDelete(!renderDelete);
    toast("Subscriptions Advantage deleted successfully");
  };

  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        <div className=" me-10 ">
          <Button
            name="Add Subscription Advantage"
            icon={CiSquarePlus}
            navigate="/subscriptionsAdvantage/add"
          />
        </div>
        {NotPage && subscriptionsAdvantage.length == 0 ? (
          <NoPageFound page={"Subscription Advantage"} />
        ) : (
          <div className="flex justify-center items-center">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mx-8 w-full">
                {arrOfCards.map((num) => (
                  <div key={num}>
                    <Skeleton className="w-full rounded-3xl" height={208} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8  w-full">
                {subscriptionsAdvantage.map((subscriptionAdvantage, index) => (
                  <div
                    key={index}
                    className="flex justify-center py-8  px-16 items-center flex-col border-2 rounded-3xl border-[#52381D]"
                  >
                    <div className="text-main-800 w-48 font-bold ">
                      {truncated[index] ? (
                        <div>
                          {subscriptionAdvantage.name}
                          {subscriptionAdvantage.name.split(" ").length > 4 && (
                            <button
                              className="underline"
                              onClick={() => toggleTruncated(index)}
                            >
                              Less
                            </button>
                          )}
                        </div>
                      ) : (
                        <div>
                          {subscriptionAdvantage.name
                            .split(" ")
                            .slice(0, 4)
                            .join(" ")}{" "}
                          ...
                          <button
                            className="underline"
                            onClick={() => toggleTruncated(index)}
                          >
                            More
                          </button>
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/subscriptionsAdvantage/edit/${subscriptionAdvantage.id}`}
                      className="text-white w-32 mt-5 mb-2 lg:w-40 bg-[#52381D] rounded-3xl right-0 hover:bg-[#52381D]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium text-sm py-2 inline-flex items-center justify-center"
                    >
                      <FaRegEdit className="w-4 h-4 me-2" /> Edit
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedName(subscriptionAdvantage.name);
                        setIdDelete(subscriptionAdvantage.id);
                        setShowModal(true);
                      }}
                      className="text-[#C90000] w-32 lg:w-40 border border-[#C90000] rounded-3xl right-0 hover:text-white hover:bg-[#C90000]/60 font-medium text-sm py-2 inline-flex items-center justify-center"
                    >
                      <RiDeleteBinLine className="w-4 h-4 me-2" /> Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-center pt-3">
          {subscriptionsAdvantage.length >= 0 ? (
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
        {showModal && (
          <ConfirmDelete
            page="SubscriptionAdvantage"
            name={selectedName}
            onClose={() => setShowModal(false)}
            onConfirm={() => {
              deleteSubscriptionAdvantage(idDelete);
              setShowModal(false);
            }}
          />
        )}
      </div>
    </>
  );
}
