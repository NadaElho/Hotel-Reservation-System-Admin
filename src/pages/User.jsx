import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { CiSquarePlus } from "react-icons/ci";
import axios from "axios";

export default function User() {
  const [users, setUsers] = useState([]);
  const currentPage = 1; 
  const[renderDelete,seteRenderDelete]=useState(false);
  const cols = [
    { col: 'Id' },
    { col: 'Name' },
    { col: 'Email' },
    { col: 'Role' },
    { col: 'Images' },
    { col: 'Action' }
  ];


  useEffect(() => {
    getAllUsers();
  }, [currentPage,renderDelete]);

  const getAllBranches = async () => {
    const { data } = await axios.get(`http://localhost:3000/api/v1/usres`,{
      headers: {
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NDM0YWE1ZDc1MGEzZmE3NDFlN2YyOCIsImVtYWlsIjoicmFuYXNzczEyMzQ1Njc4OUBnbWFpbC5jb20iLCJpYXQiOjE3MTU2OTA0NjZ9.GwGzJ74GlbvexRgakGUNVqxRP2fKjZf1zPTQqoS69qU"
      }
    });
    console.log('data',data)
   
      const formattedData = data.data.map(user => ({
        id:user._id,
        name: `${user.firstName} ${user.lastName}` ,
        email: user.email,
        role: user.role,
        images: user.images,
        
      }));
      console.log('formattedData',formattedData)
      setUsers(formattedData);
    
  }
  const deleteUser=async(id)=>{
    await axios.delete(`http://localhost:3000/api/v1/hotels/${id}`,
    {
      headers: {
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NDM0YWE1ZDc1MGEzZmE3NDFlN2YyOCIsImVtYWlsIjoicmFuYXNzczEyMzQ1Njc4OUBnbWFpbC5jb20iLCJpYXQiOjE3MTU2OTA0NjZ9.GwGzJ74GlbvexRgakGUNVqxRP2fKjZf1zPTQqoS69qU"
      }}
    )
    seteRenderDelete(!renderDelete)
  }
  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        <Button name="Add User " icon={CiSquarePlus}  navigate = "addUser"/>
        <div className="p-4 border-2 border-gray-200 border-solid rounded-3xl dark:border-gray-700">
          <Table cols={cols} data={users} linkEdit='editUser'  page='user' handleDelete={deleteUser} />
        </div>
      </div>
    </>
  );
}
