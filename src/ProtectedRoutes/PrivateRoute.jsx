import {Outlet , Navigate} from 'react-router-dom'

const PrivateRoute = () =>  localStorage.getItem("token") ? <Navigate to="/rooms" /> : <Outlet/>

export default PrivateRoute;
