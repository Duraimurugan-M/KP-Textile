import jwt from "jsonwebtoken";

export const authGuard = (req, res, next) => {
  try {

    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Not authorized"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId
    };

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      msg: "Invalid token"
    });

  }
};