const jwt = require('jsonwebtoken');
const { promisify } = require("util");

exports.verifyToken = async function (req, res, next) {
    try {
        const token = req?.headers?.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Please Login" })
        }

        const decodedData = await promisify(jwt.verify)(token, process.env.JSON_KEY);
        req.user = decodedData;
        next();
    } catch (error) {
        res.send(error);
    }
}