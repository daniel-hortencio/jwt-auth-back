const jwt = require('jsonwebtoken')

function generateToken(userId) {
    const token = jwt.sign(
        {},
        "JWT_SECRET",
        {
            subject: userId,
            expiresIn: 5 // 20 segundos
        }
    )

    return token;
}

module.exports = { generateToken }

