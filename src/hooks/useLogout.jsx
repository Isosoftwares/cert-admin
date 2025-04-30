import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { auth, setAuth } = useAuth();

  const logout = async () => {
    try {
      await axios.post(`auth/logout/client/${auth?.userId}`, {
        withCredentials: true,
      });
      setAuth({});
      localStorage.clear();
    } catch (err) {
      setAuth({});
      localStorage.clear();
    }
  };

  return logout;
};

export default useLogout;
