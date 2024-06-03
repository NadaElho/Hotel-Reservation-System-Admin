import {Outlet , Navigate} from 'react-router-dom'

const PrivateRoute = () =>  localStorage.getItem("token") ? <Navigate to="/" /> : <Outlet/>

export default PrivateRoute;
