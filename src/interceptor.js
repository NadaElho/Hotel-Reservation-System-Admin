import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});
try {
  const data = await axios.get(
    `http://localhost:3000/api/v1/users/userProfile`,
    {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  // console.log("data ", data);
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        if (config.headers)
          config.headers.authorization = ` Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
} catch (err) {
  localStorage.removeItem("token");
  // console.log("err", err.response.data.message);
}

export default axiosInstance;
