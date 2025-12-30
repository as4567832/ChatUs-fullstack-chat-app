import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>; // ya spinner
  }

  if (!token) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default ProtectedRoute;
