import {Outlet , Navigate} from 'react-router-dom'

const Guard = () => !localStorage.getItem("token") ? <Navigate to="/login" /> : <Outlet/>;

export default Guard;
