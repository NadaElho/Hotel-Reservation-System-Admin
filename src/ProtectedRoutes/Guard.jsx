import {Outlet , Navigate} from 'react-router-dom'

const Guard = () => !localStorage.getItem("token") ? <Navigate to="/" /> : <Outlet/>;

export default Guard;
