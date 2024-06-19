import { useEffect, useState } from "react";
import axiosInstance from "../interceptor";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import { FaKey } from "react-icons/fa";
import { IoKeyOutline } from "react-icons/io5";
import Loader from "../components/Loader";
function UserDetails() {
  const [reservationToUser, setReservationToUser] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [limit, setLimit] = useState(0);
  useEffect(() => {
    getAllReservationToUser();
  }, [limit]);
  const arrOfCards = [];
  for (let i = 0; i < limit; i++) {
    arrOfCards.push(i);
  }
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
  const nextSlider = (reservationIndex) => {
    setReservationToUser((prev) => {
      const newReservations = [...prev];
      if (
        newReservations[reservationIndex].changeImage <
        newReservations[reservationIndex].images.length - 1
      ) {
        newReservations[reservationIndex].changeImage += 1;
      }
      return newReservations;
    });
  };

  const prevSlider = (reservationIndex) => {
    setReservationToUser((prev) => {
      const newReservations = [...prev];
      if (newReservations[reservationIndex].changeImage > 0) {
        newReservations[reservationIndex].changeImage -= 1;
      }
      return newReservations;
    });
  };
  const getAllReservationToUser = async () => {
    try {
      setLoading(true);
      const data = await axiosInstance.get(`/reservations/${id}`);
      let roomsId = data.data.data.map(
        (reservationUser) => reservationUser.roomId._id
      );
      // console.log("data", data);
      const roomsResponse = await axiosInstance.get(
        `/rooms?roomsId=${roomsId.join(",")}`
      );
      const roomsData = roomsResponse.data.data;

      const formattedData = data.data.data.map((reservationUser) => {
        const checkInDate = new Date(reservationUser?.checkIn);
        const checkOutDate = new Date(reservationUser?.checkOut);
        const timeDifference = checkOutDate - checkInDate;
        const numberOfNights = timeDifference / (1000 * 3600 * 24);
        const roomDetails = roomsData.find(
          (room) => room._id === reservationUser.roomId._id
        );

        return {
          id: reservationUser._id,
          user: reservationUser.userId,
          room: roomDetails,
          status: reservationUser.status.name_en,
          checkIn: new Date(reservationUser?.checkIn).toLocaleDateString(),
          checkOut: new Date(reservationUser?.checkOut).toLocaleDateString(),
          night: numberOfNights,
          images: roomDetails.images,
          changeImage: 0,
        };
      });
      setLimit(formattedData.length);
      setReservationToUser(formattedData);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response?.data && err.response.status) {
        navigate("/users");
        toast.error(err.response?.data?.message || err.message);
      }
      // console.log(err.response?.data || err.message, "err");
    }
  };
  // if (isLoading) {
  //   return (
  //     <div className="lg:p-14 p-7 sm:ml-64 h-full">
  //       <div className="flex justify-center items-center h-full">
  //         <Loader />
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="lg:px-16 lg:py-10 10 p-7 sm:ml-64">
      {isLoading
        ? arrOfCards.map((num, index) => (
            <div
              key={num}
              className={` ${
                index < 1
                  ? "flex flex-col lg:flex-row-reverse justify-between items-start"
                  : ""
              } `}
            >
              {index < 1 && (
                <div className=" rounded-3xl p-5 w-80 lg:mb-0 mb-6">
                  <Skeleton className="w-full rounded-3xl" height={208} />
                </div>
              )}
              <div className="rounded-3xl lg:w-3/5 p-5 md:p-10 mb-10">
                <Skeleton className="w-full rounded-3xl" height={208} />
              </div>
            </div>
          ))
        : reservationToUser.map((user, index) => (
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
              <div className="border border-main-800 rounded-3xl lg:w-3/5 p-5 md:p-10 mb-10 text-main-400">
                <div className="grid grid-cols-1 md:grid-cols-3 ">
                  <div>
                    <p className="text-2xl text-main-800 mb-4  font-bold">
                      {user.room.hotelId.name_en} Branch
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
                      <p className={getStatusClass(user.status)}>
                        {user.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-evenly relative items-center lg:col-span-2 col-span-3  ">
                    <button
                      className={`${
                        user.changeImage === 0
                          ? "opacity-50 border-main-100 "
                          : " border-main-800  "
                      } border rounded-full   p-1`}
                      onClick={() => prevSlider(index)}
                      disabled={user.changeImage === 0}
                    >
                      <GrFormPrevious className="text-xl" />
                    </button>

                    <img
                      className="object-center rounded-3xl mx-3 w-52 md:w-72"
                      src={user.images[user.changeImage]}
                      alt="Current Branch"
                    />
                    <button
                      className={`${
                        user.changeImage === user.images.length - 1
                          ? "opacity-50 border-main-100 "
                          : " border-main-800 "
                      } border rounded-full   p-1`}
                      onClick={() => nextSlider(index)}
                      disabled={user.changeImage === user.images.length - 1}
                    >
                      <MdOutlineNavigateNext className="text-xl" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <p className="text-xl font-bold text-main-800">
                    Room Amenities
                  </p>
                  <p>
                    {user.room.amenitiesIds
                      .map((amenity) => amenity.name_en)
                      .join(", ")}
                  </p>
                </div>
                <div className="flex   mt-4 ">
                  <div className="me-32 flex">
                    <p className=" rounded-full text-3xl text-white bg-main-300  p-3 me-2">
                      <IoKeyOutline />
                    </p>
                    <div>
                      <p>
                        {" "}
                        <span className="font-bold"> Booking ID: </span> #
                        {user.id.slice(0, 8)}
                      </p>
                      <p>
                        <span className="font-bold"> Room Type:</span>{" "}
                        {user.room.roomTypeId.type_en}
                      </p>
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
