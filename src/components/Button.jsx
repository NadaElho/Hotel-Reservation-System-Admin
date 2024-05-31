import React from 'react'

export default function Button(props) {
    const {name,icon}=props;
  return (
    <>
   <div className='flex  justify-end mb-6'>

    <button type="button" className="text-white w-36  lg:w-48  bg-[#52381D]   rounded-3xl right-0 hover:bg-[#52381D]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium text-sm  py-2.5 inline-flex items-center justify-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30">
        {icon && React.createElement(icon,{ className:'w-5 h-5 me-2' })}
       {name}
        </button>
   </div>
    </>
  )
}
