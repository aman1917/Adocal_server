const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "Geeta";


const fetchuser = (req, res, next) => {
  //get user user from the jwt token & add id to req object
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ error: "Please Authenticate using a valid token" });
  }
  
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    console.error("Token Verification Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
   
};

module.exports = fetchuser;
