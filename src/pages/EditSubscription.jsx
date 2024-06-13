import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormComponent from "../components/FormComponent";
import axiosInstance from "../interceptor";
import Loader from "../components/Loader";

export default function EditSubscription() {
  const [subscriptionAdvantageOptions, setSubscriptionAdvantageOptions] =
    useState([]);
  const subscriptionsAdvantageRef = useRef(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const mode = "edit";

  const [initialValues, setInitialValues] = useState({
    name_en: "",
    name_ar: "",
    price: "",
    currency: "",
    percentage: "",
    subscriptionAdvantageIds: [],
  });

  useEffect(() => {
    const fetchSubscriptionsAdvantage = async () => {
      try {
        const response = await axiosInstance.get("/subscription-advantage");
        const subscriptionAdvantageNames = response.data.data.map(
          (subscriptionAdvantage) => ({
            id: subscriptionAdvantage._id,
            name: subscriptionAdvantage.name_en,
          })
        );
        setSubscriptionAdvantageOptions(subscriptionAdvantageNames);
      } catch (err) {
        console.error("Error fetching Subscription Advantage:", err);
      }
    };

    fetchSubscriptionsAdvantage();
  }, []);

  useEffect(() => {
    setDropdownOptions(
      subscriptionAdvantageOptions.map((option) => ({
        label: option.name,
        value: option.id,
      }))
    );
  }, [subscriptionAdvantageOptions]);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/subscriptions/${id}`);
        const subscriptionData = response.data.data;
        setInitialValues({
          name_en: subscriptionData.name_en || "",
          name_ar: subscriptionData.name_ar || "",
          percentage: subscriptionData.percentage || "",
          price: subscriptionData.price || "",
          currency: subscriptionData.currency || "",
          subscriptionAdvantageIds:
            subscriptionData.subscriptionAdvantageIds || [],
        });
        // console.log(response.data.data.subscriptionAdvantageIds);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      }
    };

    fetchSubscriptionData();
  }, [id]);

  const onSubmit = async (values) => {
    const formData = new FormData();

    for (const key in values) {
      if (key === "subscriptionAdvantageIds") {
        values[key].forEach((id) => {
          formData.append("subscriptionAdvantageIds", id);
        });
      } else {
        formData.append(key, values[key]);
      }
    }
    try {
      setLoading(true);
      await axiosInstance.patch(`/subscriptions/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(true);
      navigate("/subscriptions");
      toast.success("subscription updated successfully");
    } catch (error) {
      // console.log("Error:", error.response?.data || error.message);
      toast.error(error.response?.data || error.message);
    }
  };

  const inputs = [
    { name: "name_en", title: "English Name", type: "text" },
    { name: "name_ar", title: "Arabic Name", type: "text" },
    { name: "price", title: "Price", type: "number" },
    { name: "percentage", title: "Percentage", type: "number" },
    { name: "currency", title: "Currency", type: "text" },
    {
      name: "subscriptionAdvantageIds",
      title: "Subscriptions Advantage",
      type: "select-multiple-sub",
      options: subscriptionAdvantageOptions,
    },
  ];

  const validationSchema = Yup.object({
    name_en: Yup.string().required("English name is required"),
    name_ar: Yup.string().required("Arabic name is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    percentage: Yup.number()
      .required("Percentage is required")
      .positive("Percentage must be positive"),
    currency: Yup.string().required("Currency is required"),
    subscriptionAdvantageIds: Yup.array().min(
      1,
      "Select at least one subscription Advantage"
    ),
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
      subscriptionAdvantageOptions={subscriptionAdvantageOptions}
      subscriptionsAdvantageRef={subscriptionsAdvantageRef}
      dropdownOptions={dropdownOptions}
      mode={mode}
      page="Subscriptions Advantage"
    />
  );
}
