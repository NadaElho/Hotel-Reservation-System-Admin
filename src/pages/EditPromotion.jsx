import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormComponent from "../components/FormComponent";
import Loader from "../components/Loader";
import axiosInstance from "../interceptor";

export default function EditPromotion() {
  const navigate = useNavigate();
  const { id } = useParams();
  const mode = "edit";
  const [isLoading, setLoading] = useState(false);
  const [promotionsData, setPromotionsData] = useState({
    title_en: "",
    title_ar: "",
    percentage: "",
  });

  useEffect(() => {
    async function getDataById() {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/promotions/${id}`);
        setPromotionsData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getDataById();
  }, [id]);

  const inputs = [
    { name: "title_en", title: "English Title", type: "text" },
    { name: "title_ar", title: "Arabic Title", type: "text" },
    { name: "percentage", title: "Percentage", type: "number" },
  ];

  const validationSchema = Yup.object({
    title_en: Yup.string().required("English Title is required"),
    title_ar: Yup.string().required("Arabic Title is required"),
    percentage: Yup.string().required("Percentage is required"),
  });

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("title_en", values.title_en);
    formData.append("title_ar", values.title_ar);
    formData.append("percentage", values.percentage);

    try {
      setLoading(true);
      await axiosInstance.patch(`/promotions/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      navigate("/promotions");
      toast.success("promotions updated successfully");
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
          initialValues={promotionsData}
          inputs={inputs}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          mode={mode}
          page="promotion"
        />
      </div>
    </>
  );
}
