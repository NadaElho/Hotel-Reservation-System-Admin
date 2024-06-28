import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { CiSquarePlus } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

import Button from "../components/Button";
import Pagination from "../components/Pagination";
import ConfirmDelete from "../components/ConfirmDelete";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosInstance from "../interceptor";
import NoPageFound from "../components/NoPageFound";

export default function Amenity() {
  const [amenities, setAmenities] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(8);
  const [noOfPages, setNoOfPages] = useState(1);
  const [renderDelete, seteRenderDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [idDelete, setIdDelete] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [NotPage, setNotPage] = useState(false);
  const arrOfCards = [];
  for (let i = 0; i < limit; i++) {
    arrOfCards.push(i);
  }

  useEffect(() => {
    getAllAmenities();
  }, [pageNum, limit, renderDelete]);

  const getAllAmenities = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/amenities?limit=${limit}&page=${pageNum + 1}`
      );
      setNoOfPages(data.pagination.numberPages);
      const formattedData = data.data.map((branch) => ({
        id: branch._id,
        name: branch.name_en,
        images: branch.images,
        description: branch.description_en,
      }));
      setAmenities(formattedData);
      setLoading(false);
    } catch (err) {
      if (err.response.status == 404) {
        setAmenities([]);
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

  const deleteAmenity = async (id) => {
    await axiosInstance.delete(`/amenities/${id}`);
    seteRenderDelete(!renderDelete);
    toast("Aamenity deleted successfully");
  };

  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        <div className=" me-10 ">
          <Button
            name="Add Amenity"
            icon={CiSquarePlus}
            navigate="/amenities/addAmenity"
          />
        </div>
        {NotPage && amenities.length == 0 ? (
          <NoPageFound page="Amenity" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mx-8 w-full">
                {amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex justify-center h-52 items-center flex-col border-2 rounded-3xl border-[#52381D]"
                  >
                    <div className="flex items-center justify-between w-40">
                      <div className="bg-main-400 p-3 rounded-full">
                        <img
                          className={"w-5 h-5 object-cover"}
                          src={amenity?.images[0]}
                          alt="Amenity"
                        />
                      </div>
                      <p className="text-main-800 text-lg font-bold">
                        {amenity.name}
                      </p>
                    </div>
                    <Link
                      to={`/amenities/editAmenity/${amenity.id}`}
                      className="text-white w-32 mt-5 mb-2 lg:w-40 bg-[#52381D] rounded-3xl right-0 hover:bg-[#52381D]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium text-sm py-2 inline-flex items-center justify-center"
                    >
                      <FaRegEdit className="w-4 h-4 me-2" /> Edit
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedName(amenity.name);
                        setIdDelete(amenity.id);
                        setShowModal(true);
                      }}
                      className="text-[#C90000] w-32 lg:w-40 border border-[#C90000] rounded-3xl right-0 hover:text-white hover:bg-[#C90000]/60  font-medium text-sm py-2 inline-flex items-center justify-center"
                    >
                      <RiDeleteBinLine className="w-4 h-4 me-2" /> Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-center py-3">
          <Pagination
            handleLimit={handleLimit}
            limit={limit}
            pageCount={noOfPages}
            handlePageClick={handlePageClick}
          />
        </div>
        {showModal && (
          <ConfirmDelete
            page="Amenity"
            name={selectedName}
            onClose={() => setShowModal(false)}
            onConfirm={() => {
              deleteAmenity(idDelete);
              setShowModal(false);
            }}
          />
        )}
      </div>
    </>
  );
}
