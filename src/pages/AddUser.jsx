import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import FormComponent from "../components/FormComponent";
import Loader from "../components/Loader";

export default function AddUser() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const mode = "add";
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    images: [],
  };

  const inputs = [
    { name: "firstName", title: "First Name", type: "text" },
    { name: "lastName", title: "Last Name", type: "text" },
    { name: "email", title: "Email", type: "text" },
    { name: "password", title: "Password", type: "text" },
    { name: "role", title: "Role", type: "text" },
    { name: "images", title: "Images", type: "file" },
  ];

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    password: Yup.string().required("Password is required"),
    role: Yup.string().required("Role is required"),
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
      setLoading(true)
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/signUp",
        formData
      );
      setLoading(false)
      navigate("/users");
    } catch (err) {
      console.log(err.response?.data || err.message, "err");
    }
    for (let pair of formData.entries()) {
        console.log("jjjjsagggg", `${pair[0]}: ${pair[1]}`);
      }
  };
  if (loading) {
    return <div className="lg:p-14 p-7 sm:ml-64">
      <Loader/>
    </div>;
  }
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
        page="User"
      />
    </>
  );
}
