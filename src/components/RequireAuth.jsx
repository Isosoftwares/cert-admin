import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    const checkUserLoggedIn = (data) => {
        if(!data?.userId) return "/unauthorized";
        if(data?.roles?.includes("Seller")) return "/seller-home";
        if(data?.roles?.includes("Admin") || data?.roles?.includes("Accountant") || data?.roles?.includes("Dispatcher")) return "/dashboard/overview";

    } 

    return (
        auth?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.accessToken
            ? 
            <Navigate to={checkUserLoggedIn(auth)} state={{ from: location }} replace />
                : <Navigate to="/" state={{ from: location }} replace />
    );
}

export default RequireAuth;