const jwt = require('jsonwebtoken');
exports.generateToken = (userInfo) => {
    const payload = {
        email: userInfo.email,
        type: userInfo.type,
        id: userInfo._id.toString()
    }

    return jwt.sign(payload, process.env.JSON_KEY, { expiresIn: "1 days" });
}