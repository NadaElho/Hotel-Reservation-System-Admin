import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Table from "../components/Table";
import Pagination from "../components/Pagination";
import axiosInstance from "../interceptor";

export default function User() {
  const [users, setUsers] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [limit, setLimit] = useState(3);
  const [noOfPages, setNoOfPages] = useState(1);
  const [renderDelete, seteRenderDelete] = useState(false);
  const [isLoading, setLoading] = useState(false);
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
      // setLoading(false);
      setNoOfPages(data.pagination.numberPages);
      const formattedData = data.data.map((user) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role.name,
        images: user.images,
      }));
      setUsers(formattedData);
      setLoading(false);
    } catch (err) {
      console.log(err.response?.data || err.message, "err");
    }
  };

  const updateUserRole = async (values, id) => {
    const formData = new FormData();
    formData.append("role", values.role);
    try {
      await axiosInstance.patch(`/users/add-admin/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      seteRenderDelete(!renderDelete);
      toast("User Role Update successfully");
    } catch (error) {
      // console.log("Error Role:", error.response?.data || error.message);
      toast.error(error.response?.data || error.message);
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
    toast("User deleted successfully");
  };

  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        {/* <Button name="Add User " icon={CiSquarePlus}  navigate = "addUser"/> */}
        <div className="p-4 border-2 overflow-hidden border-gray-200 border-solid rounded-3xl ">
          <Table
            cols={cols}
            data={users}
            linkEdit="user-details"
            page="user"
            handleDelete={deleteUser}
            isLoading={isLoading}
            limit={limit}
            updateUserRole={updateUserRole}
          />
        </div>
        <div className="flex items-center justify-center pt-3">
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
