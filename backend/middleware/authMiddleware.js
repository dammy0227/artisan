import Student from "../models/Student.js";
import Artisan from "../models/Artisan.js";
import Admin from "../models/Admin.js";
import { verifyToken } from "../utils/jwt.js"; 


export const protect = async (req, res, next) => {
  let token;

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = await verifyToken(token);
      if (!decoded) return res.status(401).json({ message: "Invalid token" });

      let user;
      if (decoded.role === "student") {
        user = await Student.findById(decoded.id).select("-password");
      } else if (decoded.role === "artisan") {
        user = await Artisan.findById(decoded.id).select("-password");
      } else if (decoded.role === "admin") {
        user = await Admin.findById(decoded.id).select("-password");
      } else {
        return res.status(401).json({ message: "Invalid role" });
      }

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

  
      user.role = decoded.role;
      req.user = user;

      next();
    } else {
      return res.status(401).json({ message: "Token missing" });
    }
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Not authorized" });
  }
};

