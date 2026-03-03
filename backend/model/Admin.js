import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../utils/passwordutils.js";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await hashPassword(this.password);
});

adminSchema.methods.verifyPassword = function (password) {
  return comparePassword(password, this.password);
};

export default mongoose.model("Admin", adminSchema);
