import SideBar from "./components/SideBar.jsx";
import Room from "./pages/Room.jsx";
import { SkeletonTheme } from "react-loading-skeleton";

import { Route, Routes, useLocation } from "react-router-dom";
import Branch from "./pages/Branch.jsx";
import AddBranch from "./pages/AddBranch.jsx";
import EditBranch from "./pages/EditBranch.jsx";
import Login from "./pages/Login.jsx";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./ProtectedRoutes/PrivateRoute.jsx";
import Guard from "./ProtectedRoutes/Guard.jsx";
import User from "./pages/User.jsx";
import History from "./pages/History.jsx";
import Amenity from "./pages/Amenity.jsx";
import AddAmenity from "./pages/AddAmenity.jsx";
import EditAmenity from "./pages/EditAmenity.jsx";
import AddRoom from "./pages/AddRoom.jsx";
import EditRoom from "./pages/EditRoom.jsx";
import SubscriptionAdvantage from "./pages/SubscriptionAdvantage.jsx";
import AddSubscriptionAdvantage from "./pages/AddSubscriptionAdvantage.jsx";
import RoomType from "./pages/RoomType.jsx";
import AddRoomType from "./pages/AddRoomType.jsx";
import EditRoomType from "./pages/EditRoomType.jsx";
import EditsubscriptionAdvantage from "./pages/EditSubscriptionAdvantage.jsx";
import Subscription from "./pages/Subscription.jsx";
import AddSubscription from "./pages/AddSubscription.jsx";
import EditSubscription from "./pages/EditSubscription.jsx";
import Review from "./pages/Review.jsx";
import UserDetails from "./pages/UserDetails.jsx";
import ReservationStatus from "./pages/ReservationStatus.jsx";
import AddReservationStatus from "./pages/AddReservationStatus.jsx";
import EditReservationStatus from "./pages/EditReservationStatus.jsx";
import Promotion from "./pages/Promotion.jsx";
import EditPromotion from "./pages/EditPromotion.jsx";
import AddPromotion from "./pages/AddPromotion.jsx";
function App() {
  const myLoc = useLocation();

  return (
    <>
      <div>
        <div className="lg:ps-14 ps-7 sm:ml-64">
          <ToastContainer />
        </div>
        {myLoc.pathname != "/" && <SideBar />}
        <SkeletonTheme baseColor={"#EEE"} highlightColor={"#FFF"}>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route exact path="/" element={<Login />} />
            </Route>
            <Route element={<Guard />}>
              <Route path="/branches" element={<Branch />} />
              <Route path="/branches/addBranch" element={<AddBranch />} />
              <Route path="/branches/editBranch/:id" element={<EditBranch />} />

              <Route path="/users" element={<User />} />
              <Route path="/users/user-details/:id" element={<UserDetails />} />

              <Route path="/histories" element={<History />} />

              <Route
                path="/reservationStatus"
                element={<ReservationStatus />}
              />
              <Route
                path="/reservationStatus/add"
                element={<AddReservationStatus />}
              />
              <Route
                path="/reservationStatus/edit/:id"
                element={<EditReservationStatus />}
              />

              <Route path="/amenities" element={<Amenity />} />
              <Route path="/amenities/addAmenity" element={<AddAmenity />} />
              <Route
                path="/amenities/editAmenity/:id"
                element={<EditAmenity />}
              />

              <Route path="/rooms" element={<Room />} />
              <Route path="/rooms/addroom" element={<AddRoom />} />
              <Route path="/rooms/editroom/:id" element={<EditRoom />} />

              <Route
                path="/subscriptionsAdvantage"
                element={<SubscriptionAdvantage />}
              />
              <Route
                path="/subscriptionsAdvantage/add"
                element={<AddSubscriptionAdvantage />}
              />
              <Route
                path="/subscriptionsAdvantage/edit/:id"
                element={<EditsubscriptionAdvantage />}
              />

              <Route path="/roomsType" element={<RoomType />} />
              <Route path="/roomsType/add" element={<AddRoomType />} />
              <Route path="/roomsType/edit/:id" element={<EditRoomType />} />

              <Route path="/subscriptions" element={<Subscription />} />
              <Route path="/subscriptions/add" element={<AddSubscription />} />
              <Route
                path="/subscriptions/edit/:id"
                element={<EditSubscription />}
              />
              <Route path="/reviews" element={<Review />} />

              <Route path="/promotions" element={<Promotion />} />
              <Route path="/promotions/add" element={<AddPromotion />} />
              <Route path="/promotions/edit/:id" element={<EditPromotion />} />
              <Route path="**" element={<Room />} />
            </Route>
          </Routes>
        </SkeletonTheme>
      </div>
    </>
  );
}

export default App;
