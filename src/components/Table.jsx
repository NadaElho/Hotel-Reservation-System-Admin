import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function Table(props) {
  const { cols, data, link } = props;

  return (
    <>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                  <tr>
                    {cols.map((col) => (
                      <th scope="col" className="px-6 py-4" key={col.col}>
                        {col.col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-neutral-200 dark:border-white/10"
                    >
                      {Object.entries(item).map(([key, value], idx) => (
                        <td key={idx} className="whitespace-wrap  px-6 py-4">
                          {key === "images" ? (
                            <img
                              src={value[0]}
                              alt="Branch"
                              className="w-16 h-16 object-cover"
                            />
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                      <td className="whitespace-nowrap px-6 pt-10 flex justify-items-end">
                        <Link to={link}>
                          <FaRegEdit className="me-3 w-4 h-4" />
                        </Link>
                        <RiDeleteBinLine className="w-4 h-4" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
