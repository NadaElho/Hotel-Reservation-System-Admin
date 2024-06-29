import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormComponent from "../components/FormComponent";
import axiosInstance from "../interceptor";
import Loader from "../components/Loader";

export default function AddSubscription() {
  const [subscriptionAdvantageOptions, setSubscriptionAdvantageOptions] =
    useState([]);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const subscriptionsAdvantageRef = useRef(null);

  useEffect(() => {
    setDropdownOptions(
      subscriptionAdvantageOptions.map((option) => ({
        label: option.name,
        value: option.id,
      }))
    );
  }, [subscriptionAdvantageOptions]);
  const mode = "add";
  const initialValues = {
    name_en: "",
    name_ar: "",
    price: "",
    currency: "",
    percentage: "",
    subscriptionAdvantageIds: [],
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
        // console.error("Error fetching scription Advantage:", err);
        console.log(err.response?.data || err.message, "err");
      }
    };
    fetchSubscriptionsAdvantage();
  }, []);

  const onSubmit = async (values) => {
    const formData = new FormData();

    for (const key in values) {
      if (key === "subscriptionAdvantageIds") {
        values[key].forEach((id) => {
          formData.append("subscriptionAdvantageIds[]", id);
        });
      } else {
        formData.append(key, values[key]);
      }
    }
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    try {
      setLoading(true);
      await axiosInstance.post("/subscriptions", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      navigate("/subscriptions");
      toast.success("Subscription added successfully");
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data || err.message);
      console.log(err.response?.data || err.message, "err");
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
      <div className="lg:p-14  p-7  sm:ml-64">
        <FormComponent
          initialValues={initialValues}
          inputs={inputs}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          mode={mode}
          subscriptionAdvantageOptions={subscriptionAdvantageOptions}
          dropdownOptions={dropdownOptions}
          subscriptionsAdvantageRef={subscriptionsAdvantageRef}
          page="Subscriptions"
        />
      </div>
    </>
  );
}
