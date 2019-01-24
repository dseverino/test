const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");  
  if (!authHeader) {
    req.loggedIn = false;
    return next();
  }
  const token = authHeader.split(" ")[1];  
  if (!token || token === "") {
    req.loggedIn = false;
    return next();
  }
  let decodedToken
  try {
    console.log(token)
    decodedToken = jwt.verify(token, "supersecretkey")
  }
  catch (err) {
    req.loggedIn = false;    
    return next();
  }
  if (!decodedToken) {
    req.loggedIn = false;
    return next();
  }  
  req.loggedIn = true;
  req.userId = decodedToken.userId;
  next()
}