import React, { useRef, useEffect, useState } from "react";
import Dropdown from "react-dropdown-select";
import { ErrorMessage, Field, Form, Formik } from "formik";

const FormComponent = ({
  inputs,
  initialValues,
  validationSchema,
  handleImageChange,
  handleDeleteImage,
  onSubmit,
  mode,
  page,
  imagePreviews,
  amenitiesOptions,
  setTagifyInstance,
}) => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const amenitiesRef = useRef(null);

  useEffect(() => {
    setDropdownOptions(
      amenitiesOptions.map((option) => ({
        label: option,
        value: option,
      }))
    );
  }, [amenitiesOptions]);

  return (
    <div className="lg:p-14 p-7 sm:ml-64">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="mx-auto w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputs.map((input) => (
                <div className="col-span-1" key={input.name}>
                  <label
                    htmlFor={input.name}
                    className="block mb-2 text-base font-bold"
                  >
                    {input.title}
                  </label>
                  {input.type === "select-multiple" &&
                  input.name === "amenities" ? (
                    <div ref={amenitiesRef} className="mb-6">
                      <Dropdown
                        options={dropdownOptions}
                        onChange={(values) => {
                          if (setTagifyInstance) {
                            setTagifyInstance(
                              values.map((value) => value.value)
                            );
                          }
                          setFieldValue(
                            "amenities",
                            values.map((value) => value.value)
                          );
                        }}
                        multi
                      />
                    </div>
                  ) : (
                    <>
                      {input.type === "text" && (
                        <Field
                          type="text"
                          id={input.name}
                          name={input.name}
                          placeholder={`Enter ${input.title}`}
                          className="border border-main-800 text-main-400 text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5"
                        />
                      )}
                      {input.type === "textarea" && (
                        <Field
                          as="textarea"
                          id={input.name}
                          name={input.name}
                          rows="4"
                          className="border border-main-800 text-main-400 text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5"
                          placeholder={`Enter ${input.title}`}
                        />
                      )}
                      {input.type === "select" && (
                        <Field
                          as="select"
                          id={input.name}
                          name={input.name}
                          className="border border-main-800 text-main-400 text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5"
                        >
                          <option value="">
                            Select {input.title.toLowerCase()}
                          </option>
                          {input.options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </Field>
                      )}
                      {input.type === "file" && (
                        <input
                          id={input.name}
                          name={input.name}
                          type="file"
                          onChange={(event) =>
                            handleImageChange(event, setFieldValue)
                          }
                          multiple
                          className="border border-main-800 text-main-400 text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5"
                        />
                      )}
                      {input.type === "select-multiple" &&
                        input.name !== "amenities" && (
                          <Field
                            as="select"
                            id={input.name}
                            name={input.name}
                            multiple
                            className="border border-main-800 text-main-400 text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5"
                          >
                            {input.options.map((option, idx) => (
                              <option key={idx} value={option}>
                                {option}
                              </option>
                            ))}
                          </Field>
                        )}
                    </>
                  )}
                  <ErrorMessage
                    name={input.name}
                    component="div"
                    className="error text-red-500"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="bg-main-800 text-white text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5"
            >
              {mode === "add" ? `Add ${page}` : `Save ${page}`}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormComponent;
