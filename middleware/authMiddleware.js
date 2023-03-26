const jwt = require('jsonwebtoken')

const User = require("../models/user");

const { JWT_SECRET } = process.env

const authentication = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
try {
    if (bearer !== "Bearer") {
        next(res.status(401).json({ message: "Not authorized" })) ;
    }
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decodedToken.id);
        if (!user || !user.token) {
            next(res.status(401).json({ message: "Not authorized" })) ;
        }
        req.user = user;
        next();
} catch (error) {
    next(error)
    }
}

module.exports = authentication