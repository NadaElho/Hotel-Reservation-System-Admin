import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from "react-dropdown-select";
import axios from "axios";

export default function FormComponent(props) {
  const {
    inputs,
    initialValues,
    validationSchema,
    handleImageChange,
    handleDeleteImage,
    onSubmit,
    mode,
    page,
    imagePreviews,
    setTagifyInstance,
  } = props;

  const [dropdownOptions, setDropdownOptions] = useState([]);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/amenities");
        const amenityNames = response.data.data.map((amenity) => amenity.name_en);
        setDropdownOptions(
          amenityNames.map((name) => ({
            label: name,
            value: name,
          }))
        );
      } catch (err) {
        console.error("Error fetching amenities:", err);
      }
    };
    fetchAmenities();
  }, []);

  return (
    <div className="lg:p-14 p-7 sm:ml-64">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ setFieldValue, values }) => (
          <Form className="mx-auto w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputs.map((input) => {
                if (input.type === "text" || input.type === "textarea") {
                  return (
                    <div className="col-span-1" key={input.name}>
                      <label htmlFor={input.name} className="block mb-2 text-base font-bold">
                        {input.title}
                      </label>
                      <Field
                        type={input.type === "text" ? "text" : "textarea"}
                        id={input.name}
                        name={input.name}
                        placeholder={`Enter ${input.title}`}
                        className="border border-main-800 text-main-400 text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5"
                      />
                      <ErrorMessage name={input.name} component="div" className="error text-red-500" />
                    </div>
                  );
                } else if (input.type === "select") {
                  return (
                    <div className="col-span-1" key={input.name}>
                      <label htmlFor={input.name} className="block mb-2 text-base font-bold">
                        {input.title}
                      </label>
                      <Select
                        multi
                        options={dropdownOptions}
                        onChange={(values) => {
                          setFieldValue(input.name, values.map((value) => value.value));
                        }}
                      />
                      <ErrorMessage name={input.name} component="div" className="error text-red-500" />
                    </div>
                  );
                } else if (input.type === "file") {
                  return (
                    <div className="col-span-1" key={input.name}>
                      <label htmlFor="images" className="block mb-2 text-base font-bold">
                        Images
                      </label>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        onChange={(event) => handleImageChange(event, setFieldValue)}
                        multiple
                        className="border border-main-800 text-main-400 text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full"
                      />
                      <ErrorMessage name="images" component="div" className="error text-red-500" />
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-5">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="flex items-center w-full gap-2">
                            <img src={preview} alt={`Image preview ${index}`} className="w-12 h-12 object-cover rounded-full" />
                            <button type="button" onClick={() => handleDeleteImage(index, setFieldValue)} className="text-red-500">
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else if (input.type === "dropdown-select") {
                  return (
                    <div className="col-span-1" key={input.name}>
                      <label htmlFor={input.name} className="block mb-2 text-base font-bold">
                        {input.title}
                      </label>
                      <Select
                        multi
                        options={input.options.map((option) => ({
                          label: option,
                          value: option,
                        }))}
                        values={input.options
                          .filter((option) => values[input.name]?.includes(option))
                          .map((option) => ({ label: option, value: option }))}
                        onChange={(selected) => setFieldValue(input.name, selected.map((option) => option.value))}
                        className="border border-main-800 text-main-400 text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5"
                      />
                      <ErrorMessage name={input.name} component="div" className="error text-red-500" />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
            <button type="submit" className="bg-main-800 text-white text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5">
              {mode === "add" ? `Add ${page}` : `Save ${page}`}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
