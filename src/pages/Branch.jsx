import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { CiSquarePlus } from "react-icons/ci";
import axios from "axios";

export default function Branch() {
  const [branches, setBranches] = useState([]);
  const currentPage = 1;  // assuming the currentPage is 1 for simplicity
  const[renderDelete,seteRenderDelete]=useState(false);
  const cols = [
    { col: 'Id' },
    { col: 'Branch Name' },
    { col: 'Address' },
    { col: 'Phone Number' },
    { col: 'Images' },
    { col: 'Description' },
    { col: 'Action' }
  ];


  useEffect(() => {
    getAllBranches();
  }, [currentPage,renderDelete]);

  const getAllBranches = async () => {
    const { data } = await axios.get(`http://localhost:3000/api/v1/hotels`);
    console.log('data',data)
   
      const formattedData = data.data.map(branch => ({
        id:branch._id,
        name: branch.name_en,
        address: branch.address_en,
        phoneNumber: branch.phoneNumber,
        images: branch.images,
        description: branch.description_en
      }));
      console.log('formattedData',formattedData)
      setBranches(formattedData);
    
  }
  const deleteBranch=async(id)=>{
    await axios.delete(`http://localhost:3000/api/v1/hotels/${id}`,
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
        <Button name="Add Branch " icon={CiSquarePlus}  navigate = "addBranch"/>
        <div className="p-4 border-2 border-gray-200 border-solid rounded-3xl dark:border-gray-700">
          <Table cols={cols} data={branches} linkEdit='editBranch'  page='branch' handleDelete={deleteBranch} />
        </div>
      </div>
    </>
  );
}
