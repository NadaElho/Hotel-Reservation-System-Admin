import React from 'react'

export default function Table(props) {
 const {cols,rooms}=props
  return (
    <>
    <div className="flex flex-col">
  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <table
          className="min-w-full text-left text-sm font-light text-surface dark:text-white">
          <thead
            className="border-b border-neutral-200 font-medium dark:border-white/10">
            <tr>
            {
              cols.map((th)=>{
                return(
                  <th scope="col" className="px-6 py-4" key={th.col}>{th.col}</th>
                )
              })
            }
           
            </tr>
          </thead>
          <tbody>
           {
              rooms.map((room)=>{
                return(
                  <tr className="border-b border-neutral-200 dark:border-white/10">
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{room.title_en}</td>
                    <td className="whitespace-nowrap px-6 py-4">{room.roomTypeId.type_en}</td>
                    <td className="whitespace-nowrap px-6 py-4">{room.amenitiesIds.map((amenity,indx)=>{
                      return(
                        
                        <span>{indx<room.amenitiesIds.length-1 ?`${amenity.name_en} ,` : `${amenity.name_en} `}  </span>
                      )
                    })}</td>
                    <td className="whitespace-nowrap px-6 py-4">@mdo</td>
                  </tr>
                )
              })
            }
            
            {/* <tr className="border-b border-neutral-200 dark:border-white/10">
              <td className="whitespace-nowrap px-6 py-4 font-medium">2</td>
              <td className="whitespace-nowrap px-6 py-4">Jacob</td>
              <td className="whitespace-nowrap px-6 py-4">Thornton</td>
              <td className="whitespace-nowrap px-6 py-4">@fat</td>
            </tr>
            <tr className="border-b border-neutral-200 dark:border-white/10">
              <td className="whitespace-nowrap px-6 py-4 font-medium">3</td>
              <td className="whitespace-nowrap px-6 py-4">Larry</td>
              <td className="whitespace-nowrap px-6 py-4">Wild</td>
              <td className="whitespace-nowrap px-6 py-4">@twitter</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
    </>
  )
}
