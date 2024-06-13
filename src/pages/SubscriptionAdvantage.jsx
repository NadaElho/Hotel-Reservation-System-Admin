// import { useEffect, useState } from "react";
// import { CiSquarePlus } from "react-icons/ci";
// import { toast } from "react-toastify";
// import Table from "../components/Table";
// import Button from "../components/Button";
// import axiosInstance from "../interceptor";

// export default function SubscriptionAdvantage() {
//   const [subscriptionsAdvantage, setSubscriptionsAdvantage] = useState([]);
//   const [renderDelete, seteRenderDelete] = useState(false);
//   const [isLoading, setLoading] = useState(false);
//   const [limit, setLimit] = useState(0);

//   const cols = [
//     { col: "Id" },
//     { col: "Subscription Advantage" },
//     { col: "Action" },
//   ];

//   useEffect(() => {
//     getAllSubscriptionsAdvantage();
//   }, [renderDelete]);

//   const getAllSubscriptionsAdvantage = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axiosInstance.get(`/subscription-advantage`);
//       const formattedData = data.data.map((subscriptionAdvantage) => ({
//         id: subscriptionAdvantage._id,
//         name: subscriptionAdvantage.name_en,
//       }));
//       setLimit(data.length);
//       setSubscriptionsAdvantage(formattedData);
//       setLoading(false);
//     } catch (err) {
//       console.log(err.response?.data || err.message, "err");
//     }
//   };
//   const deleteSubscriptionAdvantage = async (id) => {
//     await axiosInstance.delete(`/subscription-advantage/${id}`);
//     seteRenderDelete(!renderDelete);
//     toast("Subscriptions Advantage deleted successfully");
//   };

//   return (
//     <>
//       <div className="lg:p-14 p-7 sm:ml-64">
//         <Button
//           name="Add Subscription Advantage "
//           icon={CiSquarePlus}
//           navigate="addSubscriptionAdvantage"
//         />
//         <div className="p-4 border-2 w-6/12 overflow-hidden border-gray-200 border-solid rounded-3xl dark:border-gray-700">
//           <Table
//             cols={cols}
//             data={subscriptionsAdvantage}
//             linkEdit="Subscriptions-advantage"
//             page="subscriptionAdvantage"
//             handleDelete={deleteSubscriptionAdvantage}
//             isLoading={isLoading}
//             limit={limit}
//           />
//         </div>
//       </div>
//     </>
//   );
// }

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

export default function SubscriptionAdvantage() {
  const [subscriptionsAdvantage, setSubscriptionsAdvantage] = useState([]);
  const [renderDelete, seteRenderDelete] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [limit, setLimit] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [idDelete, setIdDelete] = useState("");

  const arrOfCards = [];
  for (let i = 0; i < limit; i++) {
    arrOfCards.push(i);
  }

  useEffect(() => {
    getAllSubscriptionsAdvantage();
  }, [renderDelete]);

  const getAllSubscriptionsAdvantage = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/subscription-advantage`);
      const formattedData = data.data.map((subscriptionAdvantage) => ({
        id: subscriptionAdvantage._id,
        name: subscriptionAdvantage.name_en,
      }));
      setLimit(data.length);
      setSubscriptionsAdvantage(formattedData);
      setLoading(false);
    } catch (err) {
      console.log(err.response?.data || err.message, "err");
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mx-8 w-full">
              {subscriptionsAdvantage.map((subscriptionAdvantage) => (
                <div
                  key={subscriptionAdvantage.id}
                  className="flex justify-center h-52 items-center flex-col border-2 rounded-3xl border-[#52381D]"
                >
                  <p className="text-main-800 text-lg font-bold">
                    {subscriptionAdvantage.name}
                  </p>

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
                    className="text-[#C90000] w-32 lg:w-40 border border-[#C90000] rounded-3xl right-0 hover:text-white hover:bg-[#C90000]/60 focus:ring-4 focus:outline-none focus:ring-[#C90000]/80 font-medium text-sm py-2 inline-flex items-center justify-center"
                  >
                    <RiDeleteBinLine className="w-4 h-4 me-2" /> Delete
                  </button>
                </div>
              ))}
            </div>
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
