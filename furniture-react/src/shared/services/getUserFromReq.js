import jwt from "jsonwebtoken";

export const getUserFromReq = (req) => {
  try {
    const cookie = req.headers.cookie || "";

    const token = cookie
      .split("token=")[1]
      ?.split(";")[0];
 
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; 
  } catch (err) {
    return null;
  }
};