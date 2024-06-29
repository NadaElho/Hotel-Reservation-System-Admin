import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormComponent from "../components/FormComponent";
import Loader from "../components/Loader";
import axiosInstance from "../interceptor";

export default function AddSubscriptionAdvantage() {
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
    name_en: Yup.string().required("English name is required"),
    name_ar: Yup.string().required("Arabic name is required"),
  });

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name_en", values.name_en);
    formData.append("name_ar", values.name_ar);

    // Log formData entries for debugging
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      setLoading(true);
      await axiosInstance.post("/subscription-advantage", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      navigate("/subscriptionsAdvantage");
      toast.success("Subscription Advantage added successfully");
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
          page="Subscription Advantage"
        />
      </div>
    </>
  );
}
