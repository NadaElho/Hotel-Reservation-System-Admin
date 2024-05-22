import { useContext } from "react";
import { LanguageContext } from "../providers/LanguageContext";

const LanguageSwitch = () => {
  const { toggleLanguage, t } = useContext(LanguageContext);
  return (
    <>
      <button onClick={toggleLanguage}>translate</button>
      <div>{t("hello")}</div>
    </>
  );
};

export default LanguageSwitch;
