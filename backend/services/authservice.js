import Admin from "../model/Admin.js";
import { createToken } from "../utils/tokenutils.js";

export const createAdminOnce = async (email, password) => {
  const exists = await Admin.countDocuments();
  if (exists > 0) throw new Error("Admin already exists");

  return Admin.create({ email, password });
};

export const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error("Invalid credentials");

  const ok = await admin.verifyPassword(password);
  if (!ok) throw new Error("Invalid credentials");

  return createToken({ id: admin._id, role: "admin" });
};
