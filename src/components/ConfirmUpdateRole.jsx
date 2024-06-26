import { useState, useEffect } from "react";
import { FaRegUser } from "react-icons/fa";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../interceptor";

export default function ConfirmUpdateRole({
  onClose,
  onConfirm,
  page,
  name,
  selectedRole,
  id,
}) {
  const [roles, setRoles] = useState([]);
  const [initialRoleId, setInitialRoleId] = useState("");
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/roles");
        const rolesData = response.data.data.map((role) => ({
          id: role._id,
          name: role.name,
        }));
        setRoles(rolesData);
        const matchedRole = rolesData.find(
          (role) => role.name === selectedRole
        );
        if (matchedRole) {
          setInitialRoleId(matchedRole.id);
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const validationSchema = Yup.object({
    role: Yup.string().required("Role is required"),
  });

  return (
    <>
      <div className="fixed bg-gray-900 inset-0 bg-opacity-50 z-50 flex justify-center items-center ">
        <div className="bg-white w-[500px] h-96 rounded-3xl flex-col flex justify-center items-center ">
          <div className="rounded-full bg-main-100 p-4 text-white mb-8">
            <FaRegUser className="h-9 w-9" />
          </div>
          <h2 className="text-3xl text-main-800">Are you sure?</h2>
          <p className=" text-main-400 my-2">
            You want Update Role <span className=" text-red-500"> {name}</span>
          </p>
          <Formik
            enableReinitialize={true}
            initialValues={{ role: initialRoleId }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onConfirm(values, id);
            }}
          >
            <Form>
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-base font-bold"
                >
                  Role
                </label>
                <Field
                  as="select"
                  id="role"
                  name="role"
                  className="border border-main-800 bg-[#fff7f2] text-main-400 text-sm rounded-3xl focus:ring-main-400 focus:border-main-400 block w-full p-2.5"
                >
                  <option value="">Select Role</option>
                  {roles.map((option, idx) => (
                    <option key={idx} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="error text-red-500"
                />
              </div>

              <div className="flex justify-center mt-5">
                <button
                  type="button"
                  className="px-7 py-2 bg-main-800 text-white rounded-lg hover:bg-[#52381D]/90 focus:ring-4 focus:outline-none focus:ring-[#52381D]/50 me-4"
                  onClick={onClose}
                >
                  No, Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2  rounded-lg border focus:ring-[#C90000]/80  hover:bg-[#C90000]/60 text-[#C90000] hover:text-white  border-[#C90000] focus:ring-5 focus:outline-none"
                >
                  Yes, Update Role
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
}
