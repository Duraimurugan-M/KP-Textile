import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import customFetch from "../utils/customFetch";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      try {
        await customFetch.get("/auth/me");
        if (mounted) setStatus("ok");
      } catch {
        if (mounted) setStatus("unauthorized");
      }
    };

    verifySession();
    const handleFocus = () => {
      verifySession();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      mounted = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (status === "checking") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
