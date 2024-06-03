import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import FormComponent from '../components/FormComponent';
import { data } from 'autoprefixer';

export default function AddBranch() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const mode = 'add';
  const initialValues={
    name_en: '',
    name_ar: '',
    phoneNumber: [],
    address_en: '',
    address_ar: '',
    description_en: '',
    description_ar: '',
    images: []

  }
  


  const inputs = [
    { name: 'name_en', title: 'English Name', type: 'text' },
    { name: 'name_ar', title: 'Arabic Name', type: 'text' },
    { name: 'address_en', title: 'English Address', type: 'text' },
    { name: 'address_ar', title: 'Arabic Address', type: 'text' },
    { name: 'description_en', title: 'English Description', type: 'textarea' },
    { name: 'description_ar', title: 'Arabic Description', type: 'textarea' },
    { name: 'phoneNumber', title: 'Phone Number', type: 'phone' },
    { name: 'images', title: 'Images', type: 'file' }
  ];

  const validationSchema = Yup.object({
    name_en: Yup.string().required('English name is required'),
    name_ar: Yup.string().required('Arabic name is required'),
    phoneNumber: Yup.array()
      .of(
        Yup.string()
          .matches(/^\d{11}$/, 'Phone number must be 11 digits')
          .required('Phone number is required')
      )
      .min(1, 'At least one phone number is required'),
    address_en: Yup.string().required('English address is required'),
    address_ar: Yup.string().required('Arabic address is required'),
    description_en: Yup.string().required('English description is required'),
    description_ar: Yup.string().required('Arabic description is required'),
    images: Yup.array()
      .of(
        Yup.mixed().required('Image is required')
      )
      .min(1, 'At least one image is required'),
  });

  const handleImageChange = (event, setFieldValue) => {
    const files = Array.from(event.currentTarget.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...previews]);
    setImageFiles(prevFiles => [...prevFiles, ...files]);
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
      if (key === 'images' && values[key].length > 0) {
        values[key].forEach((image) => {
          formData.append(key, image);
        });
      } else if (key === 'phoneNumber' && values[key].length > 0) {
        values[key].forEach((phone, index) => {
          formData.append(`phoneNumber[${index}]`, phone);
        });
      } else {
        formData.append(key, values[key]);
      }
    }
    for (let pair of formData.entries()) {
      console.log('jjjjsa',`${pair[0]}: ${pair[1]}`);
    }
    try {
      const response = await axios.post('http://localhost:3000/api/v1/hotels', formData, {
        headers: {
          "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGExYzlhZWM3OGIwMzU0ZDg1NTMwYSIsImVtYWlsIjoic2FtYXIxMjNAZ21haWwuY29tIiwiaWF0IjoxNzE3NDI5MDAxfQ.SdR0EKPgdIdLTonDHBgclzY3_FHRHPvDSGDidbUyn04"
        }
      });
    //   const url =
    //   mode === "add"
    //     ? `http://localhost:3000/api/v1/hotels`
    //     : `http://localhost:3000/api/v1/hotels/${id}`;

    // const method = mode === "add" ? "post" : "patch";

    // const response =  await axios({method,url, data:formData,
    //   headers: {
    //     "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NDM0YWE1ZDc1MGEzZmE3NDFlN2YyOCIsImVtYWlsIjoicmFuYXNzczEyMzQ1Njc4OUBnbWFpbC5jb20iLCJpYXQiOjE3MTU2OTA0NjZ9.GwGzJ74GlbvexRgakGUNVqxRP2fKjZf1zPTQqoS69qU"
    //   }
    // });
      console.log("Success:", response.data);
      navigate("/branches");
    } catch (err) {
      console.log(err.message, 'err');
    }
  };
 
  return (
   <>
    <FormComponent  initialValues={initialValues}inputs={inputs}validationSchema={validationSchema} 
    handleDeleteImage={handleDeleteImage} handleImageChange={handleImageChange} imagePreviews={imagePreviews} onSubmit={onSubmit} mode={mode} page='Branch'  />
   </>
  );
}
