import { verifyTokenSafe } from "../utils/tokenutils.js";



export const authGuard = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    req.user = verifyTokenSafe(token);
    next(); // ✅ ONLY place next() is used
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
