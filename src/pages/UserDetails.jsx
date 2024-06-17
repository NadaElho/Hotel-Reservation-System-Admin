import { useEffect, useState } from "react";
import axiosInstance from "../interceptor";
import { useParams } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
// import { FaKey } from "react-icons/fa";
import { IoKeyOutline } from "react-icons/io5";
import Loader from "../components/Loader";
function UserDetails() {
  const [reservationToUser, setReservationToUser] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    getAllReservationToUser();
  }, []);
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "text-amber-400";
      case "canceled":
        return "text-red-800";
      case "Completed":
        return "text-green-500";
      default:
        return "";
    }
  };
  const getAllReservationToUser = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/reservations/${id}`);
      // setLoading(false);

      const formattedData = data.data.map((reservationUser) => {
        const checkInDate = new Date(reservationUser?.checkIn);
        const checkOutDate = new Date(reservationUser?.checkOut);
        const timeDifference = checkOutDate - checkInDate;
        const numberOfNights = timeDifference / (1000 * 3600 * 24);
        return {
          id: reservationUser._id,
          user: reservationUser.userId,
          room: reservationUser.roomId,
          status: reservationUser.status.name_en,
          checkIn: new Date(reservationUser?.checkIn).toLocaleDateString(),
          checkOut: new Date(reservationUser?.checkOut).toLocaleDateString(),
          night: numberOfNights,
        };
      });
      console.log(formattedData);
      console.log(data.data);
      setReservationToUser(formattedData);
      setLoading(false);
    } catch (err) {
      console.log(err.response?.data || err.message, "err");
    }
  };
  if (isLoading) {
    return (
      <div className="lg:p-14 p-7 sm:ml-64 h-full">
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      </div>
    );
  }
  return (
    <div className="lg:px-16 lg:py-10 10 p-7 sm:ml-64">
      {reservationToUser.map((user, index) => (
        <div
          key={user.id}
          className={` ${
            index < 1
              ? "flex flex-col lg:flex-row-reverse justify-between items-start"
              : ""
          } `}
        >
          {index < 1 && (
            <div className="border border-main-800 rounded-3xl p-5 w-80 text-main-400 lg:mb-0 mb-6">
              <div className="flex justify-between mb-5">
                <img
                  className="w-40 h-40 object-cover  rounded-3xl"
                  src={user.user.images[0]}
                  alt="Current Branch"
                />
                <div>
                  <p>#{user.user._id.slice(0, 8)}</p>
                  <p className="text-xl font-bold text-main-800">{`${user.user.firstName} ${user.user.lastName}`}</p>
                </div>
              </div>
              {user.user.phoneNumber && (
                <p>
                  <FaPhoneSquareAlt className="inline-block text-2xl" />{" "}
                  {user.user.phoneNumber}
                </p>
              )}
              <p>
                <MdOutlineMailOutline className="inline-block text-2xl" />{" "}
                {user.user.email}
              </p>

              {/* <p>{user.user.gender}</p> */}
            </div>
          )}
          <div className="border border-main-800 rounded-3xl xl:w-3/5 p-5 md:p-10 mb-10 text-main-400">
            <div className="grid grid-cols-1 md:grid-cols-3 ">
              <div>
                <p className="text-3xl text-main-800 mb-4  font-bold">
                  {user.room.title_en}
                </p>
                <div>
                  <p className="font-bold text-main-800">Booking Date</p>
                  <p>
                    {user.checkIn} - {user.checkOut}
                  </p>
                  <p> {user.night} nights</p>
                </div>
                <div className=" mt-5">
                  <p className="text-main-800  font-bold">Status</p>
                  <p className={getStatusClass(user.status)}>{user.status}</p>
                </div>
              </div>
              <div className="flex justify-evenly relative items-center lg:col-span-2 col-span-3  ">
                <div className="border border-main-800 rounded-full   p-1 ">
                  <GrFormPrevious className="text-xl" />
                </div>

                <img
                  className="object-center rounded-3xl mx-3 w-72"
                  src={user.room.images[0]}
                  alt="Current Branch"
                />
                <div className="border border-main-800 rounded-full  p-1  ">
                  <MdOutlineNavigateNext className="text-xl" />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <p className="text-xl font-bold text-main-800">Current Booking</p>
              <p>
                AC, Shower, Double Bed, Towel, Bathtub, Coffee Set, LED TV, Wifi{" "}
              </p>
            </div>
            <div className="flex   mt-4 ">
              <div className="me-32 flex">
                <p className=" rounded-full text-3xl text-white bg-main-300  p-3 me-2">
                  <IoKeyOutline />
                </p>
                <div>
                  <p>Booking ID #{user.id.slice(0, 8)}</p>
                  <p>King Deluxe B-23</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserDetails;
