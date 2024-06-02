import LanguageSwitch from "./components/LanguageSwitch";
import ModeSwitch from "./components/ModeSwitch";
import LanguageProvider from "./providers/LanguageContext";
import { I18nextProvider } from "react-i18next";
import { useState } from "react";
import i18n from "./utils/i18n.js";
import SideBar from "./components/SideBar.jsx";
import Table from "./components/Table.jsx";
import Room from "./pages/Room.jsx";

import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Branch from "./pages/Branch.jsx";
import AddBranch from "./pages/AddBranch.jsx";
import EditBranch from "./pages/EditBranch.jsx";
function App() {
  const [dark, setDark] = useState("light");
  const handleMode  =()=>{
    setDark((mode)=> mode === 'light' ? 'dark' : 'light')
  }
  // console.log(dark)
  return (
    <>
      <div className= {`${dark} dark:bg-black dark:text-white` }>
        <I18nextProvider i18n={i18n}>
          <LanguageProvider>
          <div className="lg:ps-14 ps-7 sm:ml-64">

          <LanguageSwitch /> 
          </div>
            <BrowserRouter>
          <SideBar/>
           <Routes>
            
    
            <Route path="/" element={<Room />} />
            <Route path="/branches" element={<Branch />} />
            <Route path="/branches/addBranch" element={<AddBranch />} />
            <Route path="/branches/editBranch/:id" element={<EditBranch />} />
            <Route path="/rooms" element={<Room/>} />
           </Routes>
            </BrowserRouter>
            {/* <Room/> */}
            {/* <Room/> */}
              
               {/* <ModeSwitch mode={handleMode}/> */}
    
          
            
          </LanguageProvider>
        </I18nextProvider>
      </div>
    </>
  );
}

export default App;
