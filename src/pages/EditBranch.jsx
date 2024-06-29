import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormComponent from "../components/FormComponent";
import Loader from "../components/Loader";
import axiosInstance from "../interceptor";

export default function EditBranch() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const mode = "edit";
  const [isLoading, setLoading] = useState(false);
  const [hotelData, setHotelData] = useState({
    name_en: "",
    name_ar: "",
    phoneNumber: [],
    address_en: "",
    address_ar: "",
    description_en: "",
    description_ar: "",
    latitude: "",
    longitude: "",
    images: [],
  });

  useEffect(() => {
    async function getDataById() {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/hotels/${id}`);
        setHotelData(data.data);
        setImagePreviews(data.data.images);
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
    { name: "latitude", title: "Latitude", type: "text" },
    { name: "longitude", title: "Longitude", type: "text" },
    { name: "address_en", title: "English Address", type: "text" },
    { name: "address_ar", title: "Arabic Address", type: "text" },
    { name: "description_en", title: "English Description", type: "textarea" },
    { name: "description_ar", title: "Arabic Description", type: "textarea" },
    { name: "phoneNumber", title: "Phone Number", type: "phone" },
    { name: "images", title: "Images", type: "file" },
  ];

  const validationSchema = Yup.object({
    name_en: Yup.string().required("English name is required"),
    name_ar: Yup.string().required("Arabic name is required"),
    latitude: Yup.string().required("latitude is required"),
    longitude: Yup.string().required("longitude is required"),
    phoneNumber: Yup.array()
      .of(
        Yup.string()
          .matches(/^\d{11}$/, "Phone number must be 11 digits")
          .required("Phone number is required")
      )
      .min(1, "At least one phone number is required"),
    address_en: Yup.string().required("English address is required"),
    address_ar: Yup.string().required("Arabic address is required"),
    description_en: Yup.string().required("English description is required"),
    description_ar: Yup.string().required("Arabic description is required"),
    images: Yup.array()
      .of(Yup.mixed().required("Image is required"))
      .min(1, "At least one image is required"),
  });

  const onSubmit = async (values) => {
    const formData = new FormData();
    for (const key in values) {
      if (key === "_id" || key === "__v") continue;
      if (key === "images" && values[key].length > 0) {
        values[key].forEach((image) => {
          if (image instanceof File) {
            formData.append(`images`, image);
          }
        });
      } else if (key === "phoneNumber" && values[key].length > 0) {
        values[key].forEach((phone, index) => {
          formData.append(`phoneNumber[${index}]`, phone);
        });
      } else {
        formData.append(key, values[key]);
      }
    }
    try {
      setLoading(true);
      await axiosInstance.patch(`/hotels/${id}`, formData);
      setLoading(false);
      navigate("/branches");
      toast.success("Branch updated successfully");
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
      <div className="lg:p-14 p-7  sm:ml-64">
        <FormComponent
          initialValues={hotelData}
          inputs={inputs}
          validationSchema={validationSchema}
          imagePrev={imagePreviews}
          onSubmit={onSubmit}
          mode={mode}
          page="Branch"
        />
      </div>
    </>
  );
}
