import LanguageSwitch from "./components/LanguageSwitch";
import ModeSwitch from "./components/ModeSwitch";
import LanguageProvider from "./providers/LanguageContext";
import { I18nextProvider } from "react-i18next";
import { useState } from "react";
import i18n from "./utils/i18n.js";
import SideBar from "./components/SideBar.jsx";
import Table from "./components/Table.jsx";
import Room from "./pages/Room.jsx";
function App() {
  const [dark, setDark] = useState("light");
  const handleMode  =()=>{
    setDark((mode)=> mode === 'light' ? 'dark' : 'light')
  }
  // console.log(dark)
  return (
    <>
      <div className= {`${dark} dark:bg-black dark:text-white` }>
        {/* <I18nextProvider i18n={i18n}>
          <LanguageProvider> */}
          
            <SideBar/>
           
                <Room/>
               <ModeSwitch mode={handleMode}/>
    
          
            {/* <LanguageSwitch /> */}
          {/* </LanguageProvider>
        </I18nextProvider> */}
      </div>
    </>
  );
}

export default App;
