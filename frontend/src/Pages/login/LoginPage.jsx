
// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Container,
//   TextField,
//   Typography,
//   Paper,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// export default function LoginPage() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     username: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleLogin = () => {
//     // ✅ No validation, no auth
//     // Any login is accepted
//     navigate("/app");
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         backgroundColor: "background.default",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <Container maxWidth="sm">
//         <Paper elevation={3} sx={{ p: 4 }}>
//           <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
//             Billing & Trading Software
//           </Typography>

//           <Typography
//             variant="body2"
//             color="text.secondary"
//             align="center"
//             mb={3}
//           >
//             Login to continue
//           </Typography>

//           <TextField
//             fullWidth
//             label="Username"
//             name="username"
//             value={form.username}
//             onChange={handleChange}
//             margin="normal"
//           />

//           <TextField
//             fullWidth
//             label="Password"
//             name="password"
//             type="password"
//             value={form.password}
//             onChange={handleChange}
//             margin="normal"
//           />

//           <Button
//             fullWidth
//             variant="contained"
//             size="large"
//             sx={{ mt: 3 }}
//             onClick={handleLogin}
//           >
//             Login
//           </Button>
//         </Paper>
//       </Container>
//     </Box>
//   );
// }


import React, { useState } from "react";
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



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleLogin = async () => {
  try {
    setLoading(true);
    const res = await customFetch.post("/auth/login", form);

    if (res.data.success) {
      toast.success("Login successful ✅");
      setTimeout(() => {
        navigate("/app");
      }, 500);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed ❌");
  } finally {
    setLoading(false);
  }
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
        {/* 🔹 TOP BRAND */}
        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          sx={{ mb: 1 }}
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

        {/* 🔐 LOGIN CARD */}
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
          }}
        >
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
  variant="contained"
  size="large"
  sx={{ mt: 3 }}
  onClick={handleLogin}
  disabled={loading}
>
  {loading ? "Logging in..." : "Login"}
</Button>

        </Paper>

        {/* 🔻 FOOTER */}
        <Typography
  color="text.secondary"
  align="center"
  sx={{
    mt: 5,                 // ⬆ more space above
    fontSize: { xs: 12, md: 17 }, // 📱 mobile / 🖥 desktop
    whiteSpace: { md: "nowrap" }, // 🖥 single line on desktop
    lineHeight: 1.6,
  }}
>
  © All rights reserved. Powered by{" "}
  <span style={{ fontWeight: 600 }}>
    Ematix Embedded & Software Solutions
  </span>
</Typography>

      </Container>
    </Box>
  );
}
