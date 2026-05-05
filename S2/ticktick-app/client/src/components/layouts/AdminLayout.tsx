import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";

const AdminLayout = () => {
  const navigate = useNavigate();

  const { loading, user } = useAuth();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user?.role !== "admin") {
        navigate("/unauthorized", { replace: true });
      } else {
        setAuthorized(true);
      }
    }
  }, [loading, user, navigate]);

  if(loading) return <LoadingScreen/>

  if (!authorized) return null;

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
