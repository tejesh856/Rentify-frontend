import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { datacontext } from "../Datacontext";

export default function Protectedroute({ Element }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { setTokenState } = useContext(datacontext);
  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const response = await fetch("https://rentify-backend-nine.vercel.app/api/authstatus", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setTokenState(true);
        } else {
          if (
            location.pathname === "/login" ||
            location.pathname === "/register"
          ) {
            navigate(location.pathname);
          }
        }
      } catch (error) {
        setLoading(false);
        console.error("Error checking authToken:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthToken();
  }, [navigate, location.pathname, setTokenState]);

  if (loading) return null;

  return <Element />;
}
