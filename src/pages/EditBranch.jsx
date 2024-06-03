import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import FormComponent from '../components/FormComponent';

export default function EditBranch() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const mode = 'edit' 
  const [loading, setLoading] = useState(false);
  const [hotelData, setHotelData] = useState({
    name_en: '',
    name_ar: '',
    phoneNumber: [],
    address_en: '',
    address_ar: '',
    description_en: '',
    description_ar: '',
    images: []
  });

  useEffect(() => {
   
      async function getDataById() {
        try {
          setLoading(true);
          const { data } = await axios.get(`http://localhost:3000/api/v1/hotels/${id}`);
          setHotelData(data.data);
          setImagePreviews(data.data.images);
          setLoading(false);
          console.log(data.data)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      getDataById();
    
  }, [id]);

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
      if (key === '_id' || key === '__v') continue;
      if (key === 'images' && values[key].length > 0) {
        // formData.append('images', values[key][0]);
          values[key].forEach((image, index) => {
              formData.append(`images`, image);
          });
      } else if (key === 'phoneNumber' && values[key].length > 0) {
          values[key].forEach((phone, index) => {
              formData.append(`phoneNumber[${index}]`, phone);
          });
          // formData.append('phoneNumber', values[key][0]);


      } else {
          formData.append(key, values[key]);
      }
  }
    for (let pair of formData.entries()) {
      console.log('jjjjsa',`${pair[0]}: ${pair[1]}`);
    }
    try {
      
    //   const response =  await axios.patch(`http://localhost:3000/api/v1/hotels/${id}`,
    //   formData,
       
    //    { headers: {
    //     "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NDM0YWE1ZDc1MGEzZmE3NDFlN2YyOCIsImVtYWlsIjoicmFuYXNzczEyMzQ1Njc4OUBnbWFpbC5jb20iLCJpYXQiOjE3MTU2OTA0NjZ9.GwGzJ74GlbvexRgakGUNVqxRP2fKjZf1zPTQqoS69qU",
    //     "Content-Type": "multipart/form-data"
    //   }
    // }
    //   );
    const response = await axios.patch(`http://localhost:3000/api/v1/hotels/${id}`,
      formData,
      {
        headers: {
          "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NDM0YWE1ZDc1MGEzZmE3NDFlN2YyOCIsImVtYWlsIjoicmFuYXNzczEyMzQ1Njc4OUBnbWFpbC5jb20iLCJpYXQiOjE3MTU2OTA0NjZ9.GwGzJ74GlbvexRgakGUNVqxRP2fKjZf1zPTQqoS69qU",
      
        }
      }
    );
      
      console.log("Success:", response.data);
      navigate("/branches");
    } catch (error) {
      console.error('Submission error:',  error.response?.data || error.message);
    }
  };
  if (loading) {
    return <div className='lg:p-14 p-7 sm:ml-64'>Loading...</div>;
  }
  return (
    <>
      <FormComponent 
        initialValues={hotelData}
        inputs={inputs}
        validationSchema={validationSchema}
        handleImageChange={handleImageChange}
        imagePreviews={imagePreviews}
        onSubmit={onSubmit}
        mode={mode}
        page='Branch'
        
        handleDeleteImage={handleDeleteImage}
      />
    </>
  );
}
