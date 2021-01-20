import JWT from "jsonwebtoken";

export default function (req, res, next) {
    const token = req.header("auth-token");
    if(!token){
        return res.status(401).send("Access Denied");
    }
    try {
        const verified  = JWT.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid Token");
    }
}