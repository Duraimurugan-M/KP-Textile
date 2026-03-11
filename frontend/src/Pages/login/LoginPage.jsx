import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import customFetch from "../../utils/customFetch.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        await customFetch.get("/auth/me");
        if (mounted) {
          navigate("/app", { replace: true });
        }
      } catch {
        // Stay on login page when not authenticated.
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await customFetch.post("/auth/login", form);

      if (res.data.success) {
        toast.success("Login successful");
        setTimeout(() => {
          navigate("/app");
        }, 150);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    await handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          sx={{ mb: 1, letterSpacing: 0.6 }}
        >
          YUVIRAA SILKS
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Billing & Trading Software
        </Typography>

        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 18px 44px rgba(15, 23, 42, 0.10)",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              align="center"
            >
              Login
            </Typography>

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 3, py: 1.4, borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </Paper>

        <Box
          sx={{
            mt: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            color="text.secondary"
            sx={{
              fontSize: { xs: 12, md: 17 },
              lineHeight: 1.6,
            }}
          >
            Copyright (c) All rights reserved. Powered by{" "}
            <Box component="span" sx={{ fontWeight: 600, display: "inline" }}>
              Ematix Embedded & Software Solutions Pvt Ltd
            </Box>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
