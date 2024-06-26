import { useEffect, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { toast } from "react-toastify";
import Table from "../components/Table";
import Button from "../components/Button";
import Pagination from "../components/Pagination";
import axiosInstance from "../interceptor";
import NoPageFound from "../components/NoPageFound";

export default function Branch() {
  const [branches, setBranches] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(3);
  const [noOfPages, setNoOfPages] = useState(1);
  const [renderDelete, seteRenderDelete] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [NotPage, setNotPage] = useState(false);
  const cols = [
    { col: "Id" },
    { col: "Branch" },
    { col: "Address" },
    { col: "Phone" },
    { col: "Images" },
    { col: "Description" },
    { col: "Action" },
  ];

  useEffect(() => {
    getAllBranches();
  }, [pageNum, limit, renderDelete]);

  const getAllBranches = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/hotels?limit=${limit}&page=${pageNum + 1}`
      );
      setNoOfPages(data.pagination.numberPages);
      const formattedData = data.data.map((branch) => ({
        id: branch._id,
        name: branch.name_en,
        address: branch.address_en,
        phoneNumber: branch.phoneNumber.join(", "),
        images: branch.images,
        description: branch.description_en,
      }));
      setBranches(formattedData);
      setLoading(false);
    } catch (err) {
      if (err.response.status == 404) {
        setBranches([]);
        setNotPage(true);
      }
      console.log(err.response?.data || err.message, "err");
    }
  };
  const deleteBranch = async (id) => {
    await axiosInstance.delete(`/hotels/${id}`);
    seteRenderDelete(!renderDelete);
    toast("Branch deleted successfully");
  };
  const handleLimit = (num) => {
    setLimit(num);
  };
  const handlePageClick = (data) => {
    setPageNum(data.selected);
  };
  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        <Button name="Add Branch " icon={CiSquarePlus} navigate="addBranch" />
        {NotPage && branches.length == 0 ? (
          <NoPageFound page="Branch" />
        ) : (
          <div className="p-4 border-2 overflow-hidden border-gray-200 border-solid rounded-3xl dark:border-gray-700">
            <Table
              cols={cols}
              data={branches}
              linkEdit="editBranch"
              page="branch"
              handleDelete={deleteBranch}
              isLoading={isLoading}
              limit={limit}
            />
          </div>
        )}
        <div className="flex items-center justify-center pt-3">
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
