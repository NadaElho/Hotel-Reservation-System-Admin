import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormComponent from "../components/FormComponent";
import Loader from "../components/Loader";
import axiosInstance from "../interceptor";

export default function AddRoomType() {
  const navigate = useNavigate();
  const mode = "add";
  const [isLoading, setLoading] = useState(false);
  const initialValues = {
    type_en: "",
    type_ar: "",
  };

  const inputs = [
    { name: "type_en", title: "English Type", type: "text" },
    { name: "type_ar", title: "Arabic Type", type: "text" },
  ];

  const validationSchema = Yup.object({
    type_en: Yup.string().required("English Type is required"),
    type_ar: Yup.string().required("Arabic Type is required"),
  });

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("type_en", values.type_en);
    formData.append("type_ar", values.type_ar);

    // Log formData entries for debugging
    // for (let pair of formData.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }

    try {
      setLoading(true);
      await axiosInstance.post("/room-type", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      navigate("/roomsType");
      toast.success("Room Type added successfully");
    } catch (err) {
      console.log(err.response?.data || err.message, "err");
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
      <FormComponent
        initialValues={initialValues}
        inputs={inputs}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        mode={mode}
        page="Room Type"
      />
    </>
  );
}
