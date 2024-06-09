import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormComponent from "../components/FormComponent";
import axiosInstance from "../interceptor";
import Loader from "../components/Loader";

export default function EditRoom() {
  const [amenitiesOptions, setAmenitiesOptions] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const amenitiesRef = useRef(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const mode = "edit";

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

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    setDropdownOptions(
      amenitiesOptions.map((option) => ({
        label: option.name,
        value: option.id,
      }))
    );
  }, [amenitiesOptions]);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/rooms/${id}`);
        const roomData = response.data.room;
        setInitialValues({
          roomNumber: roomData.roomNumber || "",
          title_en: roomData.title_en || "",
          title_ar: roomData.title_ar || "",
          description_en: roomData.description_en || "",
          description_ar: roomData.description_ar || "",
          amenitiesIds: roomData.amenitiesIds.map((amenity) => amenity._id) || [],
          price: roomData.price || "",
          roomTypeId: roomData.roomTypeId._id || "",
          images: roomData.images || [],
          hotelId: roomData.hotelId._id || "",
        });
        if (roomData.images && roomData.images.length > 0) {
          const previews = roomData.images.map((image) => image);
          setImagePreviews(previews);
        }
        setLoading(false);
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
          if (image instanceof File) {
            formData.append(`images`, image);
          }
        });
      } else if (key === "amenitiesIds") {
        values[key].forEach((id) => {
          formData.append("amenitiesIds", id);
        });
      } else {
        formData.append(key, values[key]);
      }
    }
    try {
      setLoading(true);
      await axiosInstance.patch(`/rooms/${id}`, formData);
      setLoading(true);
      navigate("/rooms");
      toast.success("Room updated successfully");
    } catch (error) {
      // console.log("Error:", error.response?.data || error.message);
      toast.error(error.response?.data || error.message);
    }
  };

  const inputs = [
    { name: "roomNumber", title: "Room Number", type: "number" },
    { name: "price", title: "Price", type: "number" },
    { name: "title_en", title: "English Name", type: "text" },
    { name: "title_ar", title: "Arabic Name", type: "text" },
    { name: "description_en", title: "English Description", type: "textarea" },
    { name: "description_ar", title: "Arabic Description", type: "textarea" },
    {
      name: "hotelId",
      title: "Hotel",
      type: "select",
      options: hotels,
    },
    {
      name: "roomTypeId",
      title: "Room Type",
      type: "select",
      options: roomTypes,
    },
    {
      name: "amenitiesIds",
      title: "Amenities",
      type: "select-multiple",
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
    <FormComponent
      inputs={inputs}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      handleDeleteImage={handleDeleteImage}
      handleImageChange={handleImageChange}
      imagePreviews={imagePreviews}
      amenitiesOptions={amenitiesOptions}
      amenitiesRef={amenitiesRef}
      dropdownOptions={dropdownOptions}
      mode={mode}
      page="Room"
    />
  );
}
