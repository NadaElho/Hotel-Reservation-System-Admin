import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormComponent from "../components/FormComponent";
import Loader from "../components/Loader";
import axiosInstance from "../interceptor";

export default function EditsubscriptionAdvantage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const mode = "edit";
  const [isLoading, setLoading] = useState(false);
  const [subscriptionAdvantageData, setsubscriptionAdvantageeData] = useState({
    name_en: "",
    name_ar: "",
  });

  useEffect(() => {
    async function getDataById() {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(
          `/subscription-advantage/${id}`
        );
        setsubscriptionAdvantageeData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getDataById();
  }, [id]);

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

    try {
      setLoading(true);
      await axiosInstance.patch(`/subscription-advantage/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      navigate("/subscriptionsAdvantage");
      toast.success("Subscription Advantage updated successfully");
    } catch (err) {
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
          initialValues={subscriptionAdvantageData}
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
