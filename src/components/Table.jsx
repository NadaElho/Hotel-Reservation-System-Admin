import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import ConfirmDelete from "./ConfirmDelete";
// import LinesEllipsis from "react-lines-ellipsis";
import { FaEye } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import ConfirmUpdateRole from "./ConfirmUpdateRole";
export default function Table(props) {
  const {
    cols,
    data,
    linkEdit,
    page,
    handleDelete,
    isLoading,
    limit,
    updateUserRole,
  } = props;

  const [showModal, setShowModal] = useState(false);
  const [showModalUpdateRole, setShowModalUpdateRole] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [idDelete, setIdDelete] = useState("");
  const [truncated, setTruncated] = useState([]);
  const arrOfRows = [];
  const toggleTruncated = (index) => {
    setTruncated((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  for (let i = 0; i < limit; i++) {
    arrOfRows.push(i);
  }
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "text-amber-400";
      case "canceled":
        return "text-red-800";
      case "Completed":
        return "text-green-500";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full  order text-left text-sm font-bold text-main-800 text-surface">
                <thead className="border-b border-neutral-200  font-medium text-[#313131] text-base">
                  {/* s-12 pe-4 */}
                  <tr>
                    {cols.map((col) =>
                      page == "room" && col.col == "Action" ? (
                        <th
                          scope="col"
                          className="lg:ps-9  lg:pe-1 px-6 py-4"
                          key={col.col}
                        >
                          {col.col}
                        </th>
                      ) : page == "user" && col.col == "Action" ? (
                        <th
                          scope="col"
                          className="lg:ps-9  ps-6 py-4"
                          key={col.col}
                        >
                          {col.col}
                        </th>
                      ) : (
                        <th scope="col" className="px-4 py-4" key={col.col}>
                          {col.col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={cols.length + 1} className="py-4">
                        <div>
                          {arrOfRows.map((num) => (
                            <div
                              key={num}
                              className="my-4 pb-2 border-b border-neutral-200"
                            >
                              <Skeleton className="w-full" height={80} />
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr key={index} className="border-b border-neutral-200">
                        {Object.entries(item).map(([key, value], idx) => (
                          <td key={idx} className="whitespace-wrap px-4 py-4 ">
                            {key === "images" ? (
                              <img
                                src={value[0]}
                                alt={page}
                                className="w-20 h-20 object-cover rounded-3xl"
                              />
                            ) : key === "id" ? (
                              index + 1
                            ) : key === "status" ? (
                              <span className={getStatusClass(value)}>
                                {value}
                              </span>
                            ) : key === "rating" ? (
                              <Rating
                                style={{ maxWidth: 100 }}
                                value={value}
                                // onChange={setRating}
                                readOnly
                              />
                            ) : key === "description" ? (
                              truncated[index] ? (
                                <div>
                                  {value}
                                  {value.split(" ").length > 4 && (
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
                                  {value.split(" ").slice(0, 4).join(" ")} ...
                                  <button
                                    className="underline"
                                    onClick={() => toggleTruncated(index)}
                                  >
                                    More
                                  </button>
                                </div>
                              )
                            ) : key === "subscriptionAdvantageIds" ? (
                              truncated[index] ? (
                                <div>
                                  {value}
                                  {value.split(" ").length > 4 && (
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
                                  {value.split(" ").slice(0, 4).join(" ")} ...
                                  <button
                                    className="underline"
                                    onClick={() => toggleTruncated(index)}
                                  >
                                    More
                                  </button>
                                </div>
                              )
                            ) : (
                              value
                            )}
                          </td>
                        ))}
                        {page === "history" ? null : (
                          <td className="whitespace-nowrap  py-10 flex justify-center ">
                            {page === "user" ? (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedRole(item.role);
                                    setSelectedName(item.name);
                                    setIdDelete(item.id);
                                    setShowModalUpdateRole(true);
                                  }}
                                >
                                  <FaRegEdit className="me-3 w-5 h-5 " />
                                </button>

                                <Link to={`${linkEdit}/${item.id}`}>
                                  <FaEye className="me-3 w-5 h-5 " />
                                </Link>
                              </>
                            ) : page === "review" ? null : (
                              <Link to={`${linkEdit}/${item.id}`}>
                                <FaRegEdit className="me-3 w-5 h-5 text-green-600" />
                              </Link>
                            )}
                            <button
                              onClick={() => {
                                setSelectedName(item.name);
                                setIdDelete(item.id);
                                setShowModal(true);
                              }}
                            >
                              <RiDeleteBinLine className="w-5 h-5 text-red-600" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {showModal && (
                <ConfirmDelete
                  page={page}
                  name={selectedName}
                  onClose={() => setShowModal(false)}
                  onConfirm={() => {
                    handleDelete(idDelete);
                    setShowModal(false);
                  }}
                />
              )}

              {showModalUpdateRole && (
                <ConfirmUpdateRole
                  page={page}
                  name={selectedName}
                  selectedRole={selectedRole}
                  onClose={() => setShowModalUpdateRole(false)}
                  onConfirm={(values, id) => {
                    updateUserRole(values, id);
                    setShowModalUpdateRole(false);
                  }}
                  id={idDelete}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
