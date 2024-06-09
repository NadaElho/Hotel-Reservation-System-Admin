import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import FormComponent from "../components/FormComponent";
import axiosInstance from "../interceptor";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

export default function AddRoom() {
  const [amenitiesOptions, setAmenitiesOptions] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const amenitiesRef = useRef(null);

  useEffect(() => {
    setDropdownOptions(
      amenitiesOptions.map((option) => ({
        label: option.name,
        value: option.id,
      }))
    );
  }, [amenitiesOptions]);
  const mode = "add";
  const initialValues = {
    roomNumber: "",
    title_en: "",
    title_ar: "",
    hotelId: "",
    description_en: "",
    description_ar: "",
    amenitiesIds: [],
    roomTypeId: "",
    price: "",
    images: [],
  };

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
      type: "select",
      options: hotels,
    },
    {
      name: "amenitiesIds",
      title: "Amenities",
      type: "select-multiple",
      options: amenitiesOptions,
    },
    {
      name: "roomTypeId",
      title: "Room Type",
      type: "select",
      options: roomTypes,
    },
    { name: "images", title: "Images", type: "file", multiple: true },
  ];

  const validationSchema = Yup.object({
    roomNumber: Yup.number().required("Room number is required"),
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
    fetchAmenities();
    fetchRoomTypes();
    fetchHotels();
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
      } else if (key == "amenitiesIds") {
        for (var i = 0; i < values[key].length; i++) {
          formData.append("amenitiesIds", values[key][i]);
        }
      } else {
        formData.append(key, values[key]);
      }
    }

    try {
      setLoading(true);
      await axiosInstance.post("/rooms", formData);
      setLoading(false);
      navigate("/rooms");
      toast.success("Room added successfully");
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
        dropdownOptions={dropdownOptions}
        amenitiesRef={amenitiesRef}
        page="Room"
      />
    </>
  );
}
