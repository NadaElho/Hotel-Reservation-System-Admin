import React, { useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";


export default function ConfirmDelete({ onClose,onConfirm ,page,name}) {
  
  return (
    <>
      <div className="fixed   inset-0 bg-opacity-50 z-50 flex justify-center items-center ">
        <div className="bg-grey-500  w-[500px]  h-80 rounded-3xl flex-col flex justify-center items-center ">
          {/* <h2 className="text-lg font-bold mb-4">Confirm Delete</h2> */}
          <div className="rounded-full bg-main-100 p-4 text-white mb-8">

          <RiDeleteBin5Line   className="h-9 w-9"/>
          </div>
          <h2 className="text-3xl text-main-800  ">
          Are you sure?
          </h2>
          <p className=" text-main-400 my-2">You want to delete this {page} {name}</p>
          <div>

          <button
            className="px-7 py-2 bg-main-800 text-white rounded-lg hover:bg-[#52381D]/90 focus:ring-4 focus:outline-none focus:ring-[#52381D]/50 me-4"
            onClick={onClose}
          >
            No, Cancel
          </button>
          <button
            className="mt-4 px-7 py-2 bg-[#C90000] text-white rounded-lg hover:bg-[#C90000]/80 focus:ring-5 focus:outline-none focus:ring-[#C90000]/20"
            onClick={()=>{onConfirm()}}
          >
           Yes, Delete
          </button>
          </div>
        </div>
      </div>
    </>
  );
}