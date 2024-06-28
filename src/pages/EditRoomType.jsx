import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormComponent from "../components/FormComponent";
import Loader from "../components/Loader";
import axiosInstance from "../interceptor";

export default function EditRoomType() {
  const navigate = useNavigate();
  const { id } = useParams();
  const mode = "edit";
  const [isLoading, setLoading] = useState(false);
  const [roomTypeData, setRoomTypeData] = useState({
    type_en: "",
    type_ar: "",
  });

  useEffect(() => {
    async function getDataById() {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/room-type/${id}`);
        setRoomTypeData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getDataById();
  }, [id]);

  const inputs = [
    { name: "type_en", title: "English Type", type: "text" },
    { name: "type_ar", title: "Arabic Type", type: "text" },
  ];

  const validationSchema = Yup.object({
    type_en: Yup.string().required("English type is required"),
    type_ar: Yup.string().required("Arabic typeis required"),
  });

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("type_en", values.type_en);
    formData.append("type_ar", values.type_ar);

    try {
      setLoading(true);
      await axiosInstance.patch(`/room-type/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      navigate("/roomsType");
      toast.success("Room Type updated successfully");
    } catch (err) {
      setLoading(false);
      // console.log(err.response?.data || err.message, "err");
      toast.error(err.response?.data || err.message);
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
    <>
      <div className="lg:px-14 md:pt-44 p-7  sm:ml-64">
        <FormComponent
          initialValues={roomTypeData}
          inputs={inputs}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          mode={mode}
          page="Room Type"
        />
      </div>
    </>
  );
}
