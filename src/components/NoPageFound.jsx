import React from "react";
import img from "/noPageFound.svg";
function NoPageFound({ page }) {
  console.log("page ", page);
  return (
    <div className="h-96  w-full mt-10  flex justify-center items-center flex-col ">
      <p className="sm:text-xl  text-main-400 font-link  lg:text-2xl font-bold  dark:text-[#ffffff]">
        {page == "reservation"
          ? ` No ${page} To This User `
          : ` No ${page} found in this page`}
      </p>
      <img src={img} alt="" className={`h-96 `} />
    </div>
  );
}

export default NoPageFound;
