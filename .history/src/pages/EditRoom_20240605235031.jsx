import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import FormComponent from "./EditRoomForm";
import * as Yup from "yup";

export default function EditRoom() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [initialValues, setInitialValues] = useState({
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
  const navigate = useNavigate();
  // const { id } = useParams();
  const id = "665265f60e87f143aa430760";
  const mode = "edit";

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
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/rooms/${id}`
        );
        const roomData = response.data.room;
        console.log(roomData);

        setInitialValues({
          roomNumber: roomData.roomNumber || "",
          name_en: roomData.name_en || "",
          name_ar: roomData.name_ar || "",
          description_en: roomData.description_en || "",
          description_ar: roomData.description_ar || "",
          amenities: roomData.amenities || [],
          price: roomData.price || "",
          type: roomData.type || "",
          images: roomData.images || [],
        });

        if (roomData.images && roomData.images.length > 0) {
          const previews = roomData.images.map((image) => image);
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
    { name: "price", title: "Price", type: "text" },
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
      type: "select1",
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
    }
    try {

      const esponse= await axios.patch(
        `http://localhost:3000/api/v1/rooms/${id}`,
        formData,
        {
          headers: {
            authorization:`Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/rooms");
    } catch (err) {
      console.log(err.response?.data || err.message, "err");
    }
  };

  return (
    <FormComponent
      inputs={inputs}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
  
        
          handleDeleteImage={handleDeleteImage}
          handleImageChange={(event) => handleImageChange(event, setFieldValue)}
          imagePreviews={imagePreviews}
       
          mode={mode}
          page="Room"
        />
     
  );
}
