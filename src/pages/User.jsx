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

  const getAllUsers = async () => {
    const { data } = await axios.get(`http://localhost:3000/api/v1/users`,{
      headers: {
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGExYzlhZWM3OGIwMzU0ZDg1NTMwYSIsImVtYWlsIjoic2FtYXIxMjNAZ21haWwuY29tIiwiaWF0IjoxNzE3Mzc4OTkyfQ.3up6rNJBUnpb06tzicGGvX8wL30XzVD_e0tcoBGGCYw"
      }
    });
    console.log('data',data)
   
      const formattedData = data.data.map(user => ({
        id:user._id,
        name: `${user.firstName} ${user.lastName}` ,
        email: user.email,
        role: user.role.name,
        images: user.images,
        
      }));
      console.log('formattedData',formattedData)
      setUsers(formattedData);
    
  }
  const deleteUser=async(id)=>{
    await axios.delete(`http://localhost:3000/api/v1/users/${id}`,
    {
      headers: {
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGExYzlhZWM3OGIwMzU0ZDg1NTMwYSIsImVtYWlsIjoic2FtYXIxMjNAZ21haWwuY29tIiwiaWF0IjoxNzE3Mzc4OTkyfQ.3up6rNJBUnpb06tzicGGvX8wL30XzVD_e0tcoBGGCYw"
      }}
    )
    seteRenderDelete(!renderDelete)
  }
  return (
    <>
      <div className="lg:p-14 p-7 sm:ml-64">
        {/* <Button name="Add User " icon={CiSquarePlus}  navigate = "addUser"/> */}
        <div className="p-4 border-2 border-gray-200 border-solid rounded-3xl ">
          <Table cols={cols} data={users} linkEdit='editUser'  page='user' handleDelete={deleteUser} />
        </div>
      </div>
    </>
  );
}
