import { useEffect, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { toast } from "react-toastify";

import Table from "../components/Table";
import Button from "../components/Button";
import Pagination from "../components/Pagination";
import axiosInstance from "../interceptor";
import NoPageFound from "../components/NoPageFound";

export default function Subscription() {
  const [subscriptions, setSubscription] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(3);
  const [noOfPages, setNoOfPages] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [renderDelete, seteRenderDelete] = useState(false);
  const [NotPage, setNotPage] = useState(false);
  const page = "Subscription";
  const cols = [
    { col: "Id" },
    { col: "Name" },
    { col: "Price" },
    { col: "Currency" },
    { col: "Percentage" },
    { col: "Sub Advantage" },
    { col: "Action" },
  ];

  useEffect(() => {
    getAllSubscriptions();
  }, [pageNum, limit, renderDelete]);

  const getAllSubscriptions = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/subscriptions?limit=${limit}&page=${pageNum + 1}`
      );
      setNoOfPages(data.pagination.numberPages);
      if (data.status === "success") {
        const formattedData = data.data.map((subscription) => ({
          id: subscription._id,
          name: subscription.name_en,
          price: subscription.price,
          currency: subscription.currency,
          percentage: subscription.percentage,
          subscriptionAdvantageIds: subscription.subscriptionAdvantageIds
            .map((subscriptionAdvantage) => subscriptionAdvantage.name_en)
            .join(" , "),
        }));
        setSubscription(formattedData);
        setLoading(false);
      }
    } catch (err) {
      if (err.response.status == 404) {
        setSubscription([]);
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

  const handleDeleteClick = async (roomId) => {
    await axiosInstance.delete(`/subscriptions/${roomId}`);
    seteRenderDelete(!renderDelete);
    toast("Subscription deleted successfully");
  };

  return (
    <div className="lg:p-14 p-7 sm:ml-64">
      <Button name="Add Subscription" icon={CiSquarePlus} navigate="add" />
      {NotPage && subscriptions.length == 0 ? (
        <NoPageFound page={page} />
      ) : (
        <div className="p-4 border-2 overflow-hidden border-gray-200 border-solid rounded-3xl dark:border-gray-700">
          <Table
            cols={cols}
            data={subscriptions}
            linkEdit="edit"
            page={page}
            handleDelete={handleDeleteClick}
            isLoading={isLoading}
            limit={limit}
          />
        </div>
      )}
      <div className="flex items-center justify-center py-3">
        {subscriptions.length ? (
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
    </div>
  );
}
