import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import FormComponent from "../components/FormComponent";

export default function EditRoom() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const mode = "edit";
  const initialValues = {
    roomNumber: "",
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    amenities: [],
    price: "",
    type: "",
    images: [],
  };

  const [roomData, setRoomData] = useState({
    roomNumber: "",
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    amenities: [],
    price: "",
    type: "",
    images: [],
  });
  // useEffect(() => {
  //   async function getDataById() {
  //     try {
  //       setLoading(true);
  //       const { data } = await axios.get(
  //         `http://localhost:3000/api/v1/rooms/${id}`
  //       );
  //       setRoomData(data.data);
  //       setImagePreviews(data.data.images);
  //       setLoading(false);
  //       console.log(data.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }
  //   getDataById();
  // }, [id]);
  useEffect(() => {
    // Fetch room data by id and set initial values
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/rooms/${id}`
        );
        const roomData = response.data; // Assuming room data is received as an object
        setInitialValues(roomData);
        // Set image previews if room has images
        if (roomData.images) {
          const previews = roomData.images.map((image) =>
            URL.createObjectURL(image)
          );
          setImagePreviews(previews);
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [id]);

  const inputs = [
    { name: "roomNumber", title: "Room Number", type: "text" },
    { name: "price", title: "Price (EGP)", type: "text" },
    { name: "name_en", title: "English Name", type: "text" },
    { name: "name_ar", title: "Arabic Name", type: "text" },
    { name: "description_en", title: "English Description", type: "textarea" },
    { name: "description_ar", title: "Arabic Description", type: "textarea" },
    {
      name: "amenities",
      title: "Amenities",
      type: "select",
      options: ["WiFi", "TV", "AC", "Mini Fridge", "Hair Dryer"],
    },
    {
      name: "type",
      title: "Room Type",
      type: "select",
      options: ["Standard", "Deluxe", "Suite"],
    },
    { name: "images", title: "Images", type: "file" },
  ];

  const validationSchema = Yup.object({
    roomNumber: Yup.string().required("Room number is required"),
    name_en: Yup.string().required("English name is required"),
    name_ar: Yup.string().required("Arabic name is required"),
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

  const handleImageChange = (event, setFieldValue) => {
    const files = Array.from(event.currentTarget.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    setImageFiles((prevFiles) => [...prevFiles, ...files]);
    setFieldValue("images", [...imageFiles, ...files]);
  };

  const handleDeleteImage = (index) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    const updatedFiles = [...imageFiles];
    updatedFiles.splice(index, 1);
    setImageFiles(updatedFiles);
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
    }
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/rooms/${id}`,
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, setFieldValue }) => (
        <FormComponent
          inputs={inputs}
          handleDeleteImage={handleDeleteImage}
          handleImageChange={(event) => handleImageChange(event, setFieldValue)}
          imagePreviews={imagePreviews}
          onSubmit={handleSubmit}
          mode={mode}
          page="Room"
        />
      )}
    </Formik>
    // <>
    //   <FormComponent
    //     initialValues={roomData}
    //     inputs={inputs}
    //     validationSchema={validationSchema}
    //     handleImageChange={handleImageChange}
    //     imagePreviews={imagePreviews}
    //     onSubmit={onSubmit}
    //     mode={mode}
    //     page="Room"
    //     handleDeleteImage={handleDeleteImage}
    //   />
    
    // </>
  );
}
