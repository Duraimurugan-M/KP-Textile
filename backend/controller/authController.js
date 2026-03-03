import { createAdminOnce, loginAdmin } from "../services/authservice.js";
import { verifyTokenSafe } from "../utils/tokenutils.js";

export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    await createAdminOnce(email, password);

    res.status(201).json({
      success: true,
      message: "Admin created",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const token = await loginAdmin(req.body.email, req.body.password);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 86400000,
    });

    res.json({ success: true, message: "Login successful" });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};

export const me = (req, res) => {
  const token = req.cookies.token;
  const data = verifyTokenSafe(token);

  if (!data) {
    return res.status(401).json({ success: false });
  }

  res.json({ success: true, user: data });
};
