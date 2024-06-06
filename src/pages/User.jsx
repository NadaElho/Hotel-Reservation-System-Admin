import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import axiosInstance from "../interceptor";

export default function User() {
  const [users, setUsers] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(4);
  const [noOfPages, setNoOfPages] = useState(1);
  const [renderDelete, seteRenderDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const cols = [
    { col: "Id" },
    { col: "Name" },
    { col: "Email" },
    { col: "Role" },
    { col: "Images" },
    { col: "Action" },
  ];

  useEffect(() => {
    getAllUsers();
  }, [renderDelete, pageNum, limit]);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/users?limit=${limit}&page=${pageNum + 1}`
      );
      setLoading(false);
      setNoOfPages(data.pagination.numberPages);
      const formattedData = data.data.map((user) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role.name,
        images: user.images,
      }));
      setUsers(formattedData);
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
  const deleteUser = async (id) => {
    await axiosInstance.delete(`/users/${id}`);
    seteRenderDelete(!renderDelete);
  };
  if (loading) {
    return (
      <div className="lg:p-14 p-7 sm:ml-64">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        {/* <Button name="Add User " icon={CiSquarePlus}  navigate = "addUser"/> */}
        <div className="p-4 border-2 border-gray-200 border-solid rounded-3xl ">
          <Table
            cols={cols}
            data={users}
            linkEdit="editUser"
            page="user"
            handleDelete={deleteUser}
          />
        </div>
        <div className="flex items-center justify-center py-3">
          <Pagination
            handleLimit={handleLimit}
            pageCount={noOfPages}
            limit={limit}
            handlePageClick={handlePageClick}
          />
        </div>
      </div>
    </>
  );
}
