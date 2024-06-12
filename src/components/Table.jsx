import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import ConfirmDelete from "./ConfirmDelete";
import LinesEllipsis from "react-lines-ellipsis";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Table(props) {
  const { cols, data, linkEdit, page, handleDelete, isLoading, limit } = props;
  const [showModal, setShowModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [idDelete, setIdDelete] = useState("");
  const [truncated, setTruncated] = useState([]);
  const arrOfRows = [];
  for (let i = 0; i < limit; i++) {
    arrOfRows.push(i);
  }
  const toggleTruncated = (index) => {
    setTruncated((prev) => ({ ...prev, [index]: !prev[index] }));
  };

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
                <thead className="border-b border-neutral-200  font-medium text-gray-950 text-base">
                  <tr>
                    {cols.map((col) => (
                      <th scope="col" className="px-6 py-4" key={col.col}>
                        {col.col}
                      </th>
                    ))}
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
                      <tr
                        key={index}
                        className="border-b border-neutral-200"
                      >
                        {Object.entries(item).map(([key, value], idx) => (
                          <td
                            key={idx}
                            className="whitespace-wrap px-6 py-4"
                          >
                            {key === "images" ? (
                              <img
                                src={value[0]}
                                className="w-20 h-20 object-cover rounded-3xl"
                              />
                            ) : key === "id" ? (
                              index + 1
                            ) : key === "status" ? (
                              <span className={getStatusClass(value)}>
                                {value}
                              </span>
                            ) : key === "description" ? (
                              truncated[index] ? (
                                <div>
                                  {value}
                                  <button
                                    className="underline"
                                    onClick={() => toggleTruncated(index)}
                                  >
                                    Less
                                  </button>
                                </div>
                              ) : (
                                <LinesEllipsis
                                  text={value}
                                  maxLine={2}
                                  ellipsis={
                                    <button
                                      onClick={() => toggleTruncated(index)}
                                    >
                                      ....
                                    </button>
                                  }
                                />
                              )
                            ) : (
                              value
                            )}
                          </td>
                        ))}
                        {page === "history" ? null : (
                          <td className="whitespace-nowrap px-6 pt-10 flex justify-center justify-items-end">
                            {page === "user" ? null : (
                              <Link to={`${linkEdit}/${item.id}`}>
                                <FaRegEdit className="me-3 w-4 h-4 text-green-600" />
                              </Link>
                            )}
                            <button
                              onClick={() => {
                                setSelectedName(item.name);
                                setIdDelete(item.id);
                                setShowModal(true);
                              }}
                            >
                              <RiDeleteBinLine className="w-4 h-4 text-red-600" />
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
