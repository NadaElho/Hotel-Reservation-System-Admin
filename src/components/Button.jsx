import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Button(props) {
    const {name,icon,navigate }=props;
    const navigatee = useNavigate();
  return (
    <>
   <div className='flex  justify-end mb-6'>

    <button type="button" onClick={() => {
              navigatee(navigate);
            }} className="text-white w-36  lg:w-48  bg-[#52381D]   rounded-3xl right-0 hover:bg-[#52381D]/90 focus:ring-4 focus:outline-none focus:ring-[#52381D]/50 font-medium text-sm  py-2.5 inline-flex items-center justify-center ">
        {icon && React.createElement(icon,{ className:'w-5 h-5 me-2' })}
       {name}
        </button>
   </div>
    </>
  )
}
