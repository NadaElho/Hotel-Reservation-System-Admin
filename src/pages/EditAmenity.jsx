import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormComponent from "../components/FormComponent";
import Loader from "../components/Loader";
import axiosInstance from "../interceptor";

export default function EditAmenity() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const mode = "edit";
  const [isLoading, setLoading] = useState(false);
  const [amenityData, setAmenityData] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    images: [],
  });

  useEffect(() => {
    async function getDataById() {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/amenities/${id}`);
        setLoading(false);
        setAmenityData(data.data);
        setImagePreviews(data.data.images);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getDataById();
  }, [id]);

  const inputs = [
    { name: "name_en", title: "English Name", type: "text" },
    { name: "name_ar", title: "Arabic Name", type: "text" },
    { name: "description_en", title: "English Description", type: "textarea" },
    { name: "description_ar", title: "Arabic Description", type: "textarea" },
    { name: "images", title: "Images", type: "file" },
  ];

  const validationSchema = Yup.object({
    name_en: Yup.string().required("English name is required"),
    name_ar: Yup.string().required("Arabic name is required"),
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
      } else {
        formData.append(key, values[key]);
      }
    }
    //   for (let pair of formData.entries()) {
    //     console.log(`${pair[0]}: ${pair[1]}`);
    // }
    try {
      setLoading(true);
      await axiosInstance.patch(`/amenities/${id}`, formData);
      setLoading(false);
      navigate("/amenities");
      toast.success("Amenity updated successfully");
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
      <div className="lg:p-14 p-7  sm:ml-64">
        <FormComponent
          initialValues={amenityData}
          inputs={inputs}
          validationSchema={validationSchema}
          imagePrev={imagePreviews}
          onSubmit={onSubmit}
          mode={mode}
          page="Amenity"
        />
      </div>
    </>
  );
}
