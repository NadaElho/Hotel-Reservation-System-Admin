import LanguageSwitch from "./components/LanguageSwitch";
import ModeSwitch from "./components/ModeSwitch";
import LanguageProvider from "./providers/LanguageContext";
import { I18nextProvider } from "react-i18next";
import { useState } from "react";
import i18n from "./utils/i18n.js";
import SideBar from "./components/SideBar.jsx";
import Table from "./components/Table.jsx";
import Room from "./pages/Room.jsx";

import {
  BrowserRouter,
  Route,
  Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Branch from "./pages/Branch.jsx";
import AddBranch from "./pages/AddBranch.jsx";
import EditBranch from "./pages/EditBranch.jsx";
import Login from "./pages/Login.jsx";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./ProtectedRoutes/PrivateRoute.jsx";
import Guard from "./ProtectedRoutes/Guard.jsx";
import User from "./pages/User.jsx";
import AddUser from "./pages/AddUser.jsx";
import EditUser from "./pages/EditUser.jsx";
import History from "./pages/History.jsx";
import Amenity from "./pages/Amenity.jsx";
import AddAmenity from "./pages/AddAmenity.jsx";
import EditAmenity from "./pages/EditAmenity.jsx";
import AddRoom from "./pages/AddRoom.jsx";
import EditRoom from "./pages/EditRoom.jsx";
function App() {
  const [dark, setDark] = useState("light");
  const myLoc = useLocation();
  const handleMode = () => {
    setDark((mode) => (mode === "light" ? "dark" : "light"));
  };
  return (
    <>
      <div className={`${dark} dark:bg-black dark:text-white`}>
        <I18nextProvider i18n={i18n}>
          <LanguageProvider>
            <div className="lg:ps-14 ps-7 sm:ml-64">
              {/* <LanguageSwitch /> */}
              <ToastContainer />
            </div>
            {myLoc.pathname != "/" && <SideBar />}
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route exact path="/" element={<Login />}/>
              </Route>
              <Route element={<Guard />}>
                <Route path="/branches" element={<Branch />} />
                <Route path="/branches/addBranch" element={<AddBranch />} />
                <Route
                  path="/branches/editBranch/:id"
                  element={<EditBranch />}
                />
                <Route path="/users" element={<User />} />
                {/* <Route path="/users/addUser" element={<AddUser />} />
                <Route path="/users/editUser/:id" element={<EditUser/>} /> */}
                <Route path="/histories" element={<History />} />
                <Route path="/amenities" element={<Amenity />} />
                <Route path="/amenities/addAmenity" element={<AddAmenity />} />
                <Route
                  path="/amenities/editAmenity/:id"
                  element={<EditAmenity />}
                />
                <Route path="/rooms" element={<Room />} />
                <Route path="/rooms/addroom" element={<AddRoom />} />
                <Route path="/rooms/editroom/:id" element={<AddRoom />} />
                <Route path="**" element={<Room/>}/>
              </Route>
            </Routes>
          </LanguageProvider>
        </I18nextProvider>
      </div>
    </>
  );
}

export default App;
