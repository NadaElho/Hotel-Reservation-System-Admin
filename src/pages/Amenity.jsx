import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { CiSquarePlus } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import ConfirmDelete from "../components/ConfirmDelete";
import Loader from "../components/Loader";
export default function Amenity() {
  const [amenities, setAmenities] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(8);
  const [noOfPages, setNoOfPages] = useState(1);
  const [renderDelete, seteRenderDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [idDelete, setIdDelete] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getAllAmenities();
  }, [pageNum, limit, renderDelete]);

  const getAllAmenities = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/amenities?limit=${limit}&page=${
          pageNum + 1
        }`
      );
      setNoOfPages(data.pagination.numberPages);
      const formattedData = data.data.map((branch) => ({
        id: branch._id,
        name: branch.name_en,
        images: branch.images,
        description: branch.description_en,
      }));
      setAmenities(formattedData);
      setLoading(false)
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
  const deleteAmenity = async (id) => {
    await axios.delete(`http://localhost:3000/api/v1/amenities/${id}`, {
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGExYzlhZWM3OGIwMzU0ZDg1NTMwYSIsImVtYWlsIjoic2FtYXIxMjNAZ21haWwuY29tIiwiaWF0IjoxNzE3NDI5MDAxfQ.SdR0EKPgdIdLTonDHBgclzY3_FHRHPvDSGDidbUyn04",
      },
    });
    seteRenderDelete(!renderDelete);
  };
  if (loading) {
    return <div className="lg:p-14 p-7 sm:ml-64">
      <Loader/>
    </div>;
  }
  
  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        <Button
          name="Add Branch "
          icon={CiSquarePlus}
          navigate="/amenities/addAnemity"
        />
        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-8">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex justify-center  h-52  items-center  flex-col border border-3 rounded-2xl border-main-800 bg-grey-500">
              <div className="flex items-center justify-between w-40">
                <img
                  src={amenity?.images[0]}
                  alt="Amenity"
                  className=" w-16 h-16 object-cover"
                />
                <p className="text-main-800  text-lg font-bold">
                  {amenity.name}
                </p>
              </div>
              <Link
                to={`/amenities/editAnemity/${amenity.id}`}
                className="text-white w-32 my-3 lg:w-40 bg-[#52381D]   rounded-3xl right-0 hover:bg-[#52381D]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium text-sm  py-2.5 inline-flex items-center justify-center "
              >
                <FaRegEdit className="w-4 h-4 me-2" /> Edit
              </Link>
              <button
                onClick={() => {
                  setSelectedName(amenity.name);
                  setIdDelete(amenity.id);
                  setShowModal(true);
                }}
                className="text-[#C90000] w-32  lg:w-40  border border-[#C90000]   rounded-3xl right-0 hover:text-white hover:bg-[#C90000]/60 focus:ring-4 focus:outline-none focus:ring-[##C90000]/80 font-medium text-sm  py-2.5 inline-flex items-center justify-center "
              >
                <RiDeleteBinLine className="w-4 h-4 me-2" /> Delete
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center py-3">
          <Pagination
            handleLimit={handleLimit}
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
