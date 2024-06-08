import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
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
  } = props;
  return (
    <div className="lg:p-14 p-7 sm:ml-64">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue}) => (
          <Form className="mx-auto w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputs.map((input, index) =>
                input.type === "text" ? (
                  <div className="col-span-1" key={index}>
                    <label
                      htmlFor={input.name}
                      className="block mb-2 text-base font-bold"
                    >
                      {input.title}
                    </label>
                    <Field
                      type="text"
                      id={input.name}
                      name={input.name}
                      placeholder={`Enter  ${input.title}`}
                      className="border border-main-800 text-main-400 text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5"
                    />
                    <ErrorMessage
                      name={input.name}
                      component="div"
                      className="error text-red-500"
                    />
                  </div>
                ) : input.type === "textarea" ? (
                  <div className="col-span-1" key={input.name}>
                    <label
                      htmlFor={input.name}
                      className="block mb-2 text-base font-bold"
                    >
                      {input.title}
                    </label>
                    <Field
                      as="textarea"
                      id={input.name}
                      name={input.name}
                      rows="4"
                      className="border border-main-800 text-main-400 text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5"
                      placeholder="Enter Description..."
                    ></Field>
                    <ErrorMessage
                      name={input.name}
                      component="div"
                      className="error text-red-500"
                    />
                  </div>
                ) : input.type === "phone" ? (
                  <div className="col-span-1" key={input.name}>
                    <label
                      htmlFor="phoneNumber"
                      className="block mb-2 text-base font-bold"
                    >
                      Phone Numbers
                    </label>
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
                ) : input.type === "file" ? (
                  <div className="col-span-1" key={input.name}>
                    <label
                      htmlFor="images"
                      className="block mb-2 text-base font-bold"
                    >
                      Images
                    </label>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      onChange={(event) =>
                        handleImageChange(event, setFieldValue)
                      }
                      multiple
                      className="border border-main-800 text-main-400 text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full"
                    />
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
                          <img
                            src={preview}
                            alt={`Image preview ${index}`}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(index)}
                            className="text-red-500"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
            <button
              type="submit"
              className="bg-main-800 text-white text-sm rounded-lg focus:ring-main-400 focus:border-main-400 block w-full p-2.5"
            >
              {mode == "add" ? `Add ${page}` : `Save ${page}`}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
