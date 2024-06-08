import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormComponent from "./EditRoomForm";
import * as Yup from "yup";
import axiosInstance from "../interceptor";

export default function EditRoom() {
  const [amenitiesOptions, setAmenitiesOptions] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [initialValues, setInitialValues] = useState({
    roomNumber: "",
    title_en: "",
    title_ar: "",
    hotelId: "",
    description_en: "",
    description_ar: "",
    amenitiesIds: [],
    price: "",
    roomTypeId: "",
    images: [],
  });
  const navigate = useNavigate();
  const { id } = useParams();

  const mode = "edit";

  const inputs = [
    { name: "roomNumber", title: "Room Number", type: "text" },
    { name: "price", title: "Price", type: "text" },
    { name: "title_en", title: "English Name", type: "text" },
    { name: "title_ar", title: "Arabic Name", type: "text" },
    { name: "description_en", title: "English Description", type: "textarea" },
    { name: "description_ar", title: "Arabic Description", type: "textarea" },
    {
      name: "hotelId",
      title: "Hotel",
      type: "select1",
      options: hotels,
    },
    {
      name: "roomTypeId",
      title: "Room Type",
      type: "select1",
      options: roomTypes,
    },
    {
      name: "amenitiesIds",
      title: "Amenities",
      type: "select",
      options: amenitiesOptions,
    },
    { name: "images", title: "Images", type: "file" },
  ];

  const validationSchema = Yup.object({
    roomNumber: Yup.string().required("Room number is required"),
    title_en: Yup.string().required("English name is required"),
    title_ar: Yup.string().required("Arabic name is required"),
    hotelId: Yup.string().required("Hotel ID is required"),
    description_en: Yup.string().required("English description is required"),
    description_ar: Yup.string().required("Arabic description is required"),
    amenitiesIds: Yup.array().min(1, "Select at least one amenity"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    roomTypeId: Yup.string().required("Room type is required"),
    images: Yup.array()
      .of(Yup.mixed().required("Image is required"))
      .min(1, "At least one image is required"),
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axiosInstance.get(`/rooms/${id}`);
        const roomData = response.data.room;
        setInitialValues({
          roomNumber: roomData.roomNumber || "",
          title_en: roomData.title_en || "",
          title_ar: roomData.title_ar || "",
          description_en: roomData.description_en || "",
          description_ar: roomData.description_ar || "",
          amenitiesIds:
            roomData.amenitiesIds.map((amenity) => {
              return amenity._id;
            }) || [],
          price: roomData.price || "",
          roomTypeId: roomData.roomTypeId._id || "",
          images: roomData.images || [],
          hotelId: roomData.hotelId._id,
        });
        if (roomData.images && roomData.images.length > 0) {
          const previews = roomData.images.map((image) => image);
          setImagePreviews(previews);
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    const fetchRoomTypes = async () => {
      try {
        const response = await axiosInstance.get("/room-type");
        const roomTypes = response.data.data.map((type) => ({
          id: type._id,
          name: type.type_en,
        }));
        setRoomTypes(roomTypes);
      } catch (err) {
        console.error("Error fetching types:", err);
      }
    };

    const fetchHotels = async () => {
      try {
        const response = await axiosInstance.get("/hotels");
        const hotels = response.data.data.map((name) => ({
          id: name._id,
          name: name.name_en,
        }));
        setHotels(hotels);
      } catch (err) {
        console.error("Error fetching hotels:", err);
      }
    };

    const fetchAmenities = async () => {
      try {
        const response = await axiosInstance.get("/amenities");
        const amenityNames = response.data.data.map((amenity) => ({
          id: amenity._id,
          name: amenity.name_en,
        }));
        setAmenitiesOptions(amenityNames);
      } catch (err) {
        console.error("Error fetching amenities:", err);
      }
    };

    fetchAmenities();
    fetchHotels();
    fetchRoomTypes();
    fetchRoomData();
  }, [id]);

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
      } else if (key === "amenitiesIds") {
        for (var i = 0; i < values[key].length; i++) {
          console.log(values[key][i]);
          formData.append("amenitiesIds", values[key][i]);
        }
      } else {
        formData.append(key, values[key]);
      }
    }

    try {
      await axiosInstance.patch(`/rooms/${id}`, formData);
      navigate("/rooms");
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
    }
  };

  return (
    <FormComponent
      inputs={inputs}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      handleDeleteImage={handleDeleteImage}
      handleImageChange={handleImageChange}
      imagePreviews={imagePreviews}
      amenitiesOptions={amenitiesOptions}
      mode={mode}
      page="Room"
    />
  );
}
