
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormComponent from "./Form";

export default function AddRoom() {
  const [amenitiesOptions, setAmenitiesOptions] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();
  const mode = "add";
  const initialValues = {
    roomNumber: "",
    title_en: "",
    title_ar: "",
    hotelId:"",
    description_en: "",
    description_ar: "",
    amenities: [],
    price: "",
    type: "",
    images: [],
  };

  const inputs = [
    { name: "roomNumber", title: "Room Number", type: "text" },
    { name: "price", title: "Price (EGP)", type: "text" },
    { name: "title_en", title: "English Name", type: "text" },
    { name: "title_ar", title: "Arabic Name", type: "text" },
    { name: "hotelId", title: "Hotel", type: "text" },
    { name: "description_en", title: "English Description", type: "textarea" },
    { name: "description_ar", title: "Arabic Description", type: "textarea" },

    {
      name: "amenities",
      title: "Amenities",
      type: "select-multiple",
      options: amenitiesOptions, // Pass options to FormComponent
    },
    {
      name: "type",
      title: "Room Type",
      type: "select",
      options: ["Standard", "Deluxe", "Suite"],
    },
    { name: "images", title: "Images", type: "file", multiple: true },
  ];

  const validationSchema = Yup.object({
    roomNumber: Yup.string().required("Room number is required"),
    title_en: Yup.string().required("English name is required"),
    title_ar: Yup.string().required("Arabic name is required"),
    hotelId: Yup.string().required("Hotel ID  is required"),
    description_en: Yup.string().required("English description is required"),
    description_ar: Yup.string().required("Arabic description is required"),
    amenities: Yup.array().min(1, "Select at least one amenity"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    type: Yup.string().required("Room type is required"),
    images: Yup.array()
      .of(Yup.mixed().required("Image is required"))
      .min(1, "At least one image is required"),
  });

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/amenities"
        );
        const amenityNames = response.data.data.map(
          (amenity) => amenity.name_en
        );
        console.log(amenityNames);
        setAmenitiesOptions(amenityNames);
      } catch (err) {
        console.error("Error fetching amenities:", err);
      }
    };
    fetchAmenities();
  }, []);

  const handleImageChange = (event, setFieldValue) => {
    const files = Array.from(event.currentTarget.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    setImageFiles((prevFiles) => [...prevFiles, ...files]);
    setFieldValue("images", [...imageFiles, ...files]);
  };

  const handleDeleteImage = (index, setFieldValue) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    const updatedFiles = [...imageFiles];
    updatedFiles.splice(index, 1);
    setImageFiles(updatedFiles);

    setFieldValue("images", updatedFiles);
  };

  const onSubmit = async (values) => {
    const formData = new FormData();
    for (const key in values) {
      if (key === "images" && values[key].length > 0) {
        values[key].forEach((image) => {
          formData.append(key, image);
        });
      } else {
        formData.append(key, values[key]);
      }

  for (let pair of formData.entries()) {
      console.log("jjjjsa", `${pair[0]}: ${pair[1]}`);
    }
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/rooms",
        formData,
        {
          headers: {
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGExYzlhZWM3OGIwMzU0ZDg1NTMwYSIsImVtYWlsIjoic2FtYXIxMjNAZ21haWwuY29tIiwiaWF0IjoxNzE3NDI5MDAxfQ.SdR0EKPgdIdLTonDHBgclzY3_FHRHPvDSGDidbUyn04",
          },
        }
      );
      console.log("Success:", response.data);
      navigate("/rooms");
    } catch (err) {
      console.log(err.response?.data || err.message, "err");
    }
  };

  return (
     <>
      <FormComponent
        initialValues={initialValues}
        inputs={inputs}
        validationSchema={validationSchema}
        handleDeleteImage={handleDeleteImage}
        handleImageChange={handleImageChange}
        imagePreviews={imagePreviews}
        onSubmit={onSubmit}
        mode={mode}
        amenitiesOptions={amenitiesOptions}
        page="Branch"
      />
    </>
    // <Formik
    //   initialValues={initialValues}
    //   validationSchema={validationSchema}
    //   onSubmit={onSubmit}
    // >
    //   {({ values, setFieldValue }) => (
    //     <FormComponent
    //       initialValues={initialValues}
    //       inputs={inputs}
    //       validationSchema={validationSchema}
    //       handleDeleteImage={(index) => handleDeleteImage(index, setFieldValue)}
    //       handleImageChange={(event) => handleImageChange(event, setFieldValue)}
    //       imagePreviews={imagePreviews}
    //       amenitiesOptions={amenitiesOptions}
    //       onSubmit={onSubmit}
    //       mode={mode}
    //       page="Room"
    //     />
    //   )}
    // </Formik>
  );
}
