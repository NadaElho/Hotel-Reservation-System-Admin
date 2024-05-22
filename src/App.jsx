import LanguageSwitch from "./components/LanguageSwitch";
import ModeSwitch from "./components/ModeSwitch";
import LanguageProvider from "./providers/LanguageContext";
import { I18nextProvider } from "react-i18next";
import { useState } from "react";
import i18n from "./utils/i18n.js";
function App() {
  const [dark, setDark] = useState(localStorage.getItem("dark") || "light");
  const handleMode  =()=>{
    setDark((mode)=> mode === 'light' ? 'dark' : 'light')
  }
  return (
    <>
      <div className= {`${dark} dark:bg-black dark:text-white` }>
        <h1>hello</h1>
        <I18nextProvider i18n={i18n}>
          <LanguageProvider>
            <ModeSwitch mode={handleMode}/>
            <LanguageSwitch />
          </LanguageProvider>
        </I18nextProvider>
      </div>
    </>
  );
}

export default App;
