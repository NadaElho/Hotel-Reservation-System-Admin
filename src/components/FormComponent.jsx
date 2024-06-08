import { useRef, useEffect, useState } from "react";
import Dropdown from "react-dropdown-select";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";

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
  dropdownOptions,
  amenitiesRef
}) => {
  return (
    <div className="lg:p-14 p-7 sm:ml-64">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {({ setFieldValue, values }) => (
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
                  input.name === "amenitiesIds" ? (
                    <div ref={amenitiesRef} className="mb-6">
                      <Dropdown
                        options={dropdownOptions}
                        color="#52381d"
                        style={{
                          border: "1px solid #52381d",
                          borderRadius: "6px",
                          padding: "6px"
                        }}
                        closeOnClickInput={true}
                        onChange={(selectedValues) => {
                          const amenitiesArray = selectedValues.map(
                            (value) => value.value
                          );
                          setFieldValue("amenitiesIds", amenitiesArray);
                          if (setTagifyInstance) {
                            setTagifyInstance(amenitiesArray);
                          }
                        }}
                        multi
                        values={dropdownOptions.filter(option => values.amenitiesIds.includes(option.value))}
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
                            <option key={idx} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </Field>
                      )}
                      {input.type === "file" && (
                        <div className="col-span-1" key={input.name}>

                          
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="images" className="flex items-center justify-center w-full border  border-main-800  rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex  items-center  py-2">
                                <svg className="w-8 h-8 me-8   text-main-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm  text-main-400"><span className="font-semibold">Click to upload images</span> </p>
                                
                            </div>
                            <input id="images"
                            name="images"
                            type="file"
                            onChange={(event) =>
                              handleImageChange(event, setFieldValue)
                            }
                            multiple type="file" className="hidden" />
                        </label>
                    </div> 

                          {/* <input
                            id="images"
                            name="images"
                            type="file"
                            onChange={(event) =>
                              handleImageChange(event, setFieldValue)
                            }
                            multiple
                            className="border border-main-800 text-main-400 text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full"
                          /> */}
                          <ErrorMessage
                            name="images"
                            component="div"
                            className="error text-red-500"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-5">
                            {imagePreviews.map((preview, index) => (
                              <div
                                key={index}
                                className="flex items-center w-full gap-2"
                              >
                                {
                                  page==='Amenity'?(
                                    <div className="bg-main-400 p-3 rounded-full">

                                <img
                                  src={preview}
                                  alt={`Image preview ${index}`}
                                  className="w-12 h-12 object-cover rounded-full"
                                />
                                 </div>

                                  ):(
                                    <img
                                  src={preview}
                                  alt={`Image preview ${index}`}
                                  className="w-12 h-12 object-cover rounded-full"
                                />
                                  )
                                }
                                 
                                <button
                                  type="button"
                                  onClick={() => handleDeleteImage(index, setFieldValue)}
                                  className="text-red-500"
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {input.type === "phone" && (
                        <div className="col-span-1" key={input.name}>
                          <FieldArray name="phoneNumber">
                            {({ push, remove, form }) => (
                              <div>
                                <button
                                  type="button"
                                  onClick={() => push("")}
                                  className="bg-main-800 text-white text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block p-2.5 mb-2"
                                >
                                  Add Phone Number
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {form.values.phoneNumber.map((_, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center mb-2"
                                    >
                                      <Field
                                        name={`phoneNumber[${index}]`}
                                        placeholder="Enter Phone Number"
                                        className="border border-main-800 text-main-400 text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5 mr-2"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-500"
                                      >
                                        X
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                <ErrorMessage
                                  name="phoneNumber"
                                  component="div"
                                  className="error text-red-500"
                                />
                              </div>
                            )}
                          </FieldArray>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="bg-main-800 mt-5 text-white text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5"
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
