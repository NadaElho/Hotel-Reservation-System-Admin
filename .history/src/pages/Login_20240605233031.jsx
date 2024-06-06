import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { IoLockClosedOutline } from "react-icons/io5";
import { AiOutlineMail } from "react-icons/ai";
import img from "/login.png";
import logo from "/logo.png";
import { toast } from "react-toastify";
import axiosInstance from "../interceptor";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center lg:h-screen lg:overflow-hidden min-h-screen">
      <div className="w-full p-4 lg:p-8 lg:w-1/2  flex flex-col justify-center">
        <img src={logo} className="fixed top-8 left-4 lg:left-10" />

        <h3 className="ml-2 font-bold text-grey-600 text-2xl mt-[100px] lg:mt-0">
          Welcome Back Admin
        </h3>
        <h5 className="ml-2 text-xs text-main-400 mb-4 font-semibold">
          Please enter your details
        </h5>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Email is required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            if (!values.password) {
              errors.password = "Password is required";
            }
            return errors;
          }}
          onSubmit={async ({ password, email }, { setSubmitting }) => {
            try {
              let { data } = await axiosInstance.post(
                "/users/login",
                {
                  password,
                  email,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              // if (data.data.role == "6642764acd637f7c34eb4b97") {
                localStorage.setItem("token", data.data.token);
                toast.success("You are logged in successfully");
                console.log(data);
                navigate("/rooms");
              // } else {
              //   toast.error("Only admins");
              // }
            } 
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="text-white">
              <div className="my-2">
                <div className="flex items-center gap-2 border rounded-full bg-main-300 my-1 px-3 py-1">
                  <AiOutlineMail color="white" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border-0 outline-none focus:ring-0 placeholder:text-slate-200 w-full bg-main-300"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </div>
                <div className="text-red-500 text-sm ml-2">
                  {touched.email && errors.email}
                </div>
              </div>
              <div className="my-2">
                <div className="flex items-center gap-2 border rounded-full bg-main-300 my-1 px-3 py-1">
                  <IoLockClosedOutline color="white" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border-0 outline-none focus:ring-0 placeholder:text-slate-200 w-full bg-main-300"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                </div>
                <div className="text-red-500 text-sm ml-2">
                  {touched.password && errors.password}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-main-800 border rounded-full p-2 text-white disabled:opacity-50 my-2"
                disabled={isSubmitting}
              >
                Login
              </button>
            </form>
          )}
        </Formik>
      </div>
      <div className="hidden lg:block w-1/3 lg:w-1/2">
        <img src={img} alt="Login" />
      </div>
    </div>
  );
};

export default Login;
