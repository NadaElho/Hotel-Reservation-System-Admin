import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormComponent from "../components/FormComponent";
import Loader from "../components/Loader";
import axiosInstance from "../interceptor";

export default function AddReservationStatus() {
  const navigate = useNavigate();
  const mode = "add";
  const [isLoading, setLoading] = useState(false);
  const initialValues = {
    name_en: "",
    name_ar: "",
  };

  const inputs = [
    { name: "name_en", title: "English Name", type: "text" },
    { name: "name_ar", title: "Arabic Name", type: "text" },
  ];

  const validationSchema = Yup.object({
    name_en: Yup.string().required("English Name is required"),
    name_ar: Yup.string().required("Arabic Name is required"),
  });

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name_en", values.name_en);
    formData.append("name_ar", values.name_ar);

    try {
      setLoading(true);
      await axiosInstance.post("/reservation-status", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      navigate("/reservationStatus");
      toast.success("Reservation Status added successfully");
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data || err.message);
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
    <>
      <div className="lg:px-14 md:pt-44 p-7  sm:ml-64">
        <FormComponent
          initialValues={initialValues}
          inputs={inputs}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          mode={mode}
          page="Reservation Status"
        />
      </div>
    </>
  );
}
